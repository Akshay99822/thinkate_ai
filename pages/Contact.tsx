import React, { useState } from 'react';
import { Mail, Github, Twitter, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { CREATOR_NAME } from '../constants';

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-text mb-4">Get in Touch</h1>
        <p className="text-gray-500">
            Have feedback for <strong>{CREATOR_NAME}</strong>? I'd love to hear your suggestions for ThinkMate AI!
        </p>
      </div>

      <div className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {isSubmitted ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface z-10 p-8 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-8">
                    Thanks for reaching out. I'll get back to you as soon as I can!
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                </Button>
             </div>
        ) : null}

        <form className={`space-y-6 transition-opacity duration-300 ${isSubmitted ? 'opacity-0' : 'opacity-100'}`} onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Name</label>
            <input required type="text" className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Email</label>
            <input required type="email" className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Message</label>
            <textarea required className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none h-32 resize-none" placeholder="Tell me about a feature you'd like to see..."></textarea>
          </div>
          <Button className="w-full" size="lg" isLoading={isLoading}>
             <Send className="w-4 h-4 mr-2" />
             Send Message
          </Button>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
           <div className="flex justify-center space-x-8">
             <a href="mailto:akshaykumar5056@gmail.com" className="text-gray-400 hover:text-red-400 transition-colors flex flex-col items-center group">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                </div>
               <span className="text-xs mt-2 font-medium">Email Me</span>
             </a>
           </div>
        </div>
      </div>
    </div>
  );
};