import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../constants';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signup(email, name, password);
    // Auto-verify the user immediately since email step is removed
    verifyEmail();
    setIsLoading(false);
    navigate('/chat');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-surface p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-text mb-2">Create Account</h1>
            <p className="text-gray-500">Join {APP_NAME} and start learning smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Create a strong password"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full py-3" isLoading={isLoading}>
                Sign Up <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </form>

        <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};