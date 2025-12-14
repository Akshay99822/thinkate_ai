import React from 'react';
import { MessageSquare, FileText, Image, Mic, Video, Zap } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      title: "Smart Study Chat",
      description: "Ask questions naturally. ThinkMate explains complex topics in simple language with examples."
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: "Document Analysis",
      description: "Upload PDFs, Docs, or Notes. Get instant summaries, key points, and revision quizzes."
    },
    {
      icon: <Image className="w-8 h-8 text-purple-500" />,
      title: "Visual Intelligence",
      description: "Stuck on a diagram? Snap a photo. ThinkMate analyzes and explains visual concepts."
    },
    {
      icon: <Mic className="w-8 h-8 text-red-500" />,
      title: "Voice Learning",
      description: "Speak your doubts instead of typing. Listen to explanations on the go with Text-to-Speech."
    },
    {
      icon: <Video className="w-8 h-8 text-orange-500" />,
      title: "Video Summarizer",
      description: "Upload short educational clips to extract the main takeaways quickly."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Creative Tools",
      description: "Generate analogies, mind maps, and flashcards to boost your memory retention."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-text sm:text-5xl">
            Powerful Features for <br />
            <span className="text-primary">Smarter Learning</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to ace your studies in one friendly app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};