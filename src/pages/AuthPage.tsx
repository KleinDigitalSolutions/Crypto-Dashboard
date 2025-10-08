import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SignInPage } from '../components/ui/SignIn';
import type { Testimonial } from '../components/ui/SignIn';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the confirmation link!');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleResetPassword = async () => {
    setError(null);
    const email = prompt('Please enter your email to reset your password:');
    if (email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset link sent! Check your email.');
      }
    }
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        key={isSignUp ? 'signup' : 'signin'}
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        title={isSignUp ? 'Create an Account' : 'Welcome Back'}
        description={isSignUp ? 'Join our platform to get started.' : 'Access your account and continue your journey.'}
        onSignIn={isSignUp ? handleSignUp : handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={() => setIsSignUp(true)}
      />
      {/* We can add a link to switch back to sign in */}
      {isSignUp && (
        <div className="text-center py-4">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }} className="text-violet-400 hover:underline">
            Already have an account? Sign In
          </a>
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {message && <p className="text-green-500 text-center">{message}</p>}
    </div>
  );
};

export default AuthPage;
