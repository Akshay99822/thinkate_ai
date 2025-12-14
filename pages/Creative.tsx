import React, { useState } from 'react';
import { Lightbulb, PenTool, Layout, List, Video, Clapperboard } from 'lucide-react';
import { generateResponse } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

export const Creative: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const tools = [
    {
      id: 'analogy',
      name: 'Analogy Generator',
      icon: <Lightbulb className="w-6 h-6" />,
      description: 'Explain complex concepts using simple analogies.',
      prompt: (topic: string) => `Explain "${topic}" using a simple, creative analogy that a student would understand.`
    },
    {
      id: 'mnemonics',
      name: 'Memory Aids',
      icon: <List className="w-6 h-6" />,
      description: 'Create mnemonics and acronyms to memorize lists.',
      prompt: (topic: string) => `Create a catchy mnemonic or acronym to help remember "${topic}". Explain what each letter stands for.`
    },
    {
      id: 'visual',
      name: 'Visual Describer',
      icon: <PenTool className="w-6 h-6" />,
      description: 'Generate a text description for a mental image/diagram.',
      prompt: (topic: string) => `Describe a visual diagram or mental image that would effectively explain "${topic}". Be descriptive.`
    },
    {
      id: 'simplify',
      name: 'The 5-Year-Old Test',
      icon: <Layout className="w-6 h-6" />,
      description: 'Rewrite a topic so a 5-year-old could understand it.',
      prompt: (topic: string) => `Explain "${topic}" as if you are talking to a smart 5-year-old child.`
    },
    {
      id: 'video_analysis',
      name: 'Video Concept Extractor',
      icon: <Video className="w-6 h-6" />,
      description: 'Paste a video transcript or text to extract key learning points.',
      prompt: (text: string) => `Analyze this video transcript/text and extract the key learning outcomes, main concepts, and a summary: \n\n${text}`
    },
    {
      id: 'animation',
      name: 'Animation Scripter',
      icon: <Clapperboard className="w-6 h-6" />,
      description: 'Generate a script for an educational animation.',
      prompt: (topic: string) => `Write a short script for a 1-minute educational animation about "${topic}". Include visual descriptions for each scene and the voiceover narration.`
    }
  ];

  const handleGenerate = async () => {
    if (!input.trim() || !activeTool) return;
    setIsLoading(true);
    setResult('');
    
    const tool = tools.find(t => t.id === activeTool);
    if (tool) {
        const prompt = tool.prompt(input);
        const response = await generateResponse(prompt, []);
        setResult(response);
    }
    setIsLoading(false);
  };

  const glassPanel = theme.uiStyle === 'glass' ? 'glass-panel' : 'bg-surface border border-gray-200 dark:border-gray-800';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-text mb-4">Creative Learning Tools</h1>
        <p className="text-gray-500">Break the monotony. Learn creatively.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tool Selection */}
        <div className="space-y-4">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => { setActiveTool(tool.id); setInput(''); setResult(''); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                        activeTool === tool.id 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-surface text-text border-gray-200 dark:border-gray-800 hover:border-primary/50'
                    }`}
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${activeTool === tool.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                            {tool.icon}
                        </div>
                        <span className="font-bold">{tool.name}</span>
                    </div>
                    <p className={`text-sm ${activeTool === tool.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {tool.description}
                    </p>
                </button>
            ))}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2">
            {activeTool ? (
                <div className={`p-6 rounded-2xl shadow-sm min-h-[500px] flex flex-col ${glassPanel}`}>
                    <h2 className="text-xl font-bold text-text mb-6">
                        {tools.find(t => t.id === activeTool)?.name}
                    </h2>
                    
                    <div className="flex space-x-2 mb-6">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={activeTool === 'video_analysis' ? "Paste video transcript here..." : "Enter a topic (e.g., Photosynthesis)..."}
                            className="flex-1 bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!input.trim()}>
                            Generate
                        </Button>
                    </div>

                    <div className="flex-1 bg-background/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800 overflow-y-auto">
                        {result ? (
                            <MarkdownRenderer content={result} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Lightbulb className="w-12 h-12 mb-4 opacity-20" />
                                <p>Enter a topic and hit generate to see magic!</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center bg-surface rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center text-gray-500">
                    <p>Select a creative tool from the sidebar to get started.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};