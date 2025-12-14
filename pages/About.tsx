import React from 'react';
import { User, BookOpen, Brain, ShieldCheck, Sparkles, Layers, Zap, Mail, Github, Video, ImagePlus, Mic, Monitor } from 'lucide-react';
import { APP_NAME, CREATOR_NAME } from '../constants';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Introduction */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-text mb-6">
          About <span className="text-primary">{APP_NAME}</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          The ultimate AI-powered ecosystem for students, creators, and lifelong learners.
        </p>
      </div>

      <div className="space-y-16">
        
        {/* Creator Info */}
        <section className="bg-surface p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-white dark:ring-gray-800">
                {CREATOR_NAME.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-text mb-2">{CREATOR_NAME}</h2>
              <p className="text-primary font-medium mb-6 uppercase tracking-wider text-sm">Full Stack Developer & AI Architect</p>
              
              <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 max-w-none">
                <p className="text-lg leading-relaxed">
                  I developed <strong>{APP_NAME}</strong> with a singular vision: to bridge the gap between complex AI technology and everyday education. 
                  My goal was to create a platform that doesn't just "answer questions" but actively helps you <em>create</em>, <em>visualize</em>, and <em>plan</em> your path to success.
                </p>
                <p>
                  By integrating the most advanced models from Google—including <strong>Gemini 3 Pro</strong>, <strong>Veo</strong>, and <strong>Nano Banana Pro</strong>—I've built a suite of tools that can handle everything from solving calculus problems to generating cinematic videos for your history project.
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a href="mailto:akshaykumar5056@gmail.com" className="flex items-center space-x-3 px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg">
                      <Mail size={18} />
                      <span>akshaykumar5056@gmail.com</span>
                  </a>
              </div>
            </div>
          </div>
        </section>

        {/* What Can You Do? */}
        <section>
             <h2 className="text-3xl font-bold text-text mb-8 text-center">What {APP_NAME} Can Do For You</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureBlock 
                    icon={<Video className="w-6 h-6 text-violet-500" />}
                    title="Cinematic Video Generation"
                    description="Powered by Google's Veo 3.1 model. You can simply type a prompt like 'A time-lapse of a flower blooming in a rainforest' and generate high-definition videos in Landscape or Portrait mode. Perfect for project presentations or social media content."
                />
                <FeatureBlock 
                    icon={<ImagePlus className="w-6 h-6 text-pink-500" />}
                    title="High-Fidelity Image Creation"
                    description="Using Gemini 3 Pro Image (Nano Banana Pro), you can create stunning 4K visuals from text. Whether you need a diagram for biology or concept art for a story, the creative possibilities are endless."
                />
                 <FeatureBlock 
                    icon={<Brain className="w-6 h-6 text-blue-500" />}
                    title="Intelligent Exam Prep"
                    description="The Exam Simulator doesn't just ask questions; it adapts to your needs. It provides detailed explanations for every answer, ensuring you actually understand the material rather than just memorizing it."
                />
                 <FeatureBlock 
                    icon={<BookOpen className="w-6 h-6 text-orange-500" />}
                    title="Smart Study Planning"
                    description="Overwhelmed by a syllabus? The Study Planner uses advanced reasoning to break down massive topics into manageable, day-by-day tabular schedules tailored to your intensity preference."
                />
             </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
             <h3 className="text-xl font-bold text-text mb-6 flex items-center">
                 <Monitor className="w-5 h-5 mr-3 text-gray-500"/>
                 Under The Hood
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                     <h4 className="font-bold text-text mb-2">Gemini 2.5 Flash</h4>
                     <p className="text-sm text-gray-500">Handles real-time chat, summarization, and quick edits. Optimized for low latency and high speed.</p>
                 </div>
                 <div>
                     <h4 className="font-bold text-text mb-2">Gemini 3 Pro</h4>
                     <p className="text-sm text-gray-500">Powers the complex reasoning tasks, high-resolution image generation, and deep analysis.</p>
                 </div>
                 <div>
                     <h4 className="font-bold text-text mb-2">Veo 3.1</h4>
                     <p className="text-sm text-gray-500">State-of-the-art video generation model capable of understanding physics and cinematic lighting.</p>
                 </div>
             </div>
        </section>

        {/* Footer Note */}
        <div className="text-center pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 text-sm">
                Built with ❤️ using React, TailwindCSS, and Google Gen AI SDK. <br />
                © {new Date().getFullYear()} {CREATOR_NAME}. All rights reserved.
            </p>
        </div>

      </div>
    </div>
  );
};

const FeatureBlock: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-surface p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-text mb-3">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);