import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Sparkles, MessageCircle, FileText, Image as ImageIcon, Zap, Video, MonitorPlay } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../constants';

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  const glassCard = theme.uiStyle === 'glass' ? 'glass-panel' : 'bg-surface border border-gray-100 dark:border-gray-800';
  const neonGlow = theme.uiStyle === 'neon' ? 'drop-shadow-[0_0_15px_rgba(0,255,157,0.3)]' : '';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
             <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary blur-[120px]"></div>
             <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 ${neonGlow}`}>
            <Sparkles className="w-4 h-4 mr-2" />
            {APP_NAME} - Learning Evolved
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-text tracking-tight mb-6">
            Your Personal AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Study Buddy
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10">
            A student-built AI assistant for summaries, quizzes, video analysis, and clear explanations. 
            Customize your learning environment to match your vibe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
                <Link to="/chat">
                    <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20">
                        Launch Dashboard
                    </Button>
                </Link>
            ) : (
                <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20">
                        Get Started for Free
                    </Button>
                </Link>
            )}
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Read My Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text">Why choose {APP_NAME}?</h2>
            <p className="mt-4 text-gray-500">Built by a learner, for learners. Powerful, free, and yours to customize.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              className={glassCard}
              icon={<MessageCircle className="w-6 h-6" />}
              title="Interactive Study Chat"
              description="Ask any question and get simple, step-by-step explanations instantly. It's like having a 24/7 tutor."
            />
            <FeatureCard 
              className={glassCard}
              icon={<ImageIcon className="w-6 h-6" />}
              title="Image Intelligence"
              description="Upload photos of diagrams or handwritten notes. I analyze and explain them for you."
            />
             <FeatureCard 
              className={glassCard}
              icon={<Video className="w-6 h-6" />}
              title="Video Analysis"
              description="Paste a video link or upload a clip. I'll extract the key points and summarize it."
            />
             <FeatureCard 
              className={glassCard}
              icon={<FileText className="w-6 h-6" />}
              title="Quiz Generation"
              description="Turn your notes into practice quizzes to test your knowledge before the exam."
            />
             <FeatureCard 
              className={glassCard}
              icon={<MonitorPlay className="w-6 h-6" />}
              title="Animation Ideas"
              description="Ask me to describe animations for complex topics to help you visualize them."
            />
             <FeatureCard 
              className={glassCard}
              icon={<Zap className="w-6 h-6" />}
              title="Voice Mode"
              description="Hands-free learning. Speak your questions and listen to the answers."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string, className?: string}> = ({ icon, title, description, className }) => (
  <div className={`p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);