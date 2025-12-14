import React, { useState, useRef, useEffect } from 'react';
import { Brain, FileText, Calendar, Image as ImageIcon, CheckCircle, XCircle, ArrowRight, Upload, Wand2, Download, Copy, RefreshCw, ChevronRight, BarChart, Scissors, Palette, Sparkles, Zap, ClipboardPaste, Video, ImagePlus, MonitorPlay, AlertTriangle, History, Film, Eraser, Sliders } from 'lucide-react';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { generateQuizJSON, generateStudyPlan, generateSummary, editImageWithGemini, generateImageFromPrompt, generateVideoFromPrompt, analyzeVideo, QuizQuestion } from '../services/geminiService';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ChatSessionPreview } from '../types';

type Tab = 'quiz' | 'summary' | 'plan' | 'image-edit' | 'image-gen' | 'video-gen' | 'video-analysis' | 'history';

export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { id: 'quiz', label: 'Quiz Me', icon: <Brain size={18} /> },
    { id: 'plan', label: 'Study Planner', icon: <Calendar size={18} /> },
    { id: 'summary', label: 'Summarizer', icon: <FileText size={18} /> },
    { id: 'history', label: 'Chat History', icon: <History size={18} /> },
    { id: 'image-edit', label: 'Image Editor', icon: <ImageIcon size={18} /> },
    { id: 'video-analysis', label: 'Video Analyzer', icon: <Film size={18} /> },
    { id: 'image-gen', label: 'Image Creator', icon: <ImagePlus size={18} /> },
    { id: 'video-gen', label: 'Video Creator', icon: <Video size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-text mb-2">Student Toolkit</h1>
        <p className="text-gray-500">Professional tools to supercharge your learning process.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <div className="bg-surface p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 inline-flex flex-wrap justify-center">
            {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm md:text-base mb-1 sm:mb-0 ${
                activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
            </button>
            ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-surface rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 md:p-8 min-h-[600px] transition-all">
        {activeTab === 'quiz' && <QuizTool />}
        {activeTab === 'summary' && <SummarizerTool />}
        {activeTab === 'plan' && <PlannerTool />}
        {activeTab === 'history' && <HistoryTool />}
        {activeTab === 'image-edit' && <ImageEditorTool />}
        {activeTab === 'video-analysis' && <VideoAnalysisTool />}
        {activeTab === 'image-gen' && <ImageGeneratorTool />}
        {activeTab === 'video-gen' && <VideoGeneratorTool />}
      </div>
    </div>
  );
};

// --- QUIZ TOOL ---

const QuizTool: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setStatus('loading');
    const qs = await generateQuizJSON(topic, difficulty, numQuestions);
    if (qs.length > 0) {
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setIsAnswerChecked(false);
      setSelectedOption(null);
      setStatus('active');
    } else {
      setStatus('idle');
      alert("Failed to generate quiz. Please try again.");
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsAnswerChecked(true);
    const currentQ = questions[currentIndex];
    if (selectedOption.trim() === currentQ.answer.trim()) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setStatus('finished');
    }
  };

  if (status === 'idle') {
    return (
      <div className="max-w-xl mx-auto py-10 animate-in fade-in duration-500">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600">
                <Brain size={48} />
            </div>
            <h2 className="text-2xl font-bold text-text">Exam Simulator</h2>
            <p className="text-gray-500">Test your knowledge on any subject with AI-generated questions.</p>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-text mb-2">Subject / Topic</label>
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                    placeholder="e.g. Thermodynamics, French History, JavaScript..."
                    className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-text mb-2">Difficulty</label>
                    <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-text mb-2">Length</label>
                    <select 
                        value={numQuestions} 
                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                        className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                    >
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={15}>15 Questions</option>
                    </select>
                </div>
            </div>

            <Button onClick={startQuiz} className="w-full py-4 text-lg" disabled={!topic.trim()}>
                Start Exam
            </Button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 space-y-6">
        <div className="relative">
             <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center">
            <h3 className="text-lg font-bold text-text">Generating Questions...</h3>
            <p className="text-gray-500">Reviewing study materials on "{topic}"</p>
        </div>
      </div>
    );
  }

  if (status === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto py-12 text-center animate-in zoom-in-95 duration-300">
        <div className="mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 text-3xl font-bold mb-4 ${percentage >= 70 ? 'border-green-500 text-green-500' : 'border-primary text-primary'}`}>
                {percentage}%
            </div>
            <h2 className="text-3xl font-bold text-text mb-2">Exam Completed</h2>
            <p className="text-gray-500">You scored {score} out of {questions.length}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8 text-left border border-gray-200 dark:border-gray-800">
             <h4 className="font-bold text-text mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center"><BarChart size={18} className="mr-2"/> Performance Summary</h4>
             <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between items-center">
                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Correct Answers</span>
                    <span className="font-bold text-text">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500"/> Incorrect Answers</span>
                    <span className="font-bold text-text">{questions.length - score}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Topic</span>
                    <span className="font-medium text-text capitalize">{topic}</span>
                </div>
             </div>
        </div>

        <div className="flex gap-4">
            <Button onClick={() => setStatus('idle')} variant="outline" className="flex-1">
                New Topic
            </Button>
            <Button onClick={startQuiz} className="flex-1">
                Retry Quiz
            </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
             <span className="text-xs font-bold text-primary uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
             <span className="text-xs font-medium text-gray-400">Score: {score}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div key={currentIndex} className="mb-8 animate-in slide-in-from-right duration-500">
        <div className="bg-background rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
             <h3 className="text-xl md:text-2xl font-bold text-text leading-snug">{question.question}</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, idx) => {
            let stateClass = "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 bg-background";
            let icon = <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 mr-3">{String.fromCharCode(65 + idx)}</div>;
            
            if (isAnswerChecked) {
              const isCorrectOption = option.trim() === question.answer.trim();
              const isSelectedOption = selectedOption === option;

              if (isCorrectOption) {
                stateClass = "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500/50";
                icon = <CheckCircle className="w-6 h-6 text-green-500 mr-3" />;
              } else if (isSelectedOption) {
                stateClass = "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500/50";
                icon = <XCircle className="w-6 h-6 text-red-500 mr-3" />;
              } else {
                 stateClass = "opacity-40 border-gray-200 dark:border-gray-800 grayscale";
              }
            } else if (selectedOption === option) {
                stateClass = "border-primary bg-primary/10 ring-1 ring-primary";
                icon = <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3"><CheckCircle size={14} /></div>;
            }

            return (
              <button 
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${stateClass}`}
              >
                {icon}
                <span className={`text-base ${isAnswerChecked && option.trim() === question.answer.trim() ? 'font-bold text-green-700 dark:text-green-300' : 'text-text'}`}>
                    {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Area */}
      {isAnswerChecked && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl mb-8 border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
                <h5 className="font-bold text-blue-800 dark:text-blue-200 text-sm mb-1">Explanation</h5>
                <p className="text-blue-900 dark:text-blue-100 leading-relaxed">
                    {question.explanation}
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        {!isAnswerChecked ? (
          <Button onClick={handleCheck} disabled={!selectedOption} size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20">Check Answer</Button>
        ) : (
          <Button onClick={handleNext} size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20">
            {currentIndex === questions.length - 1 ? "Finish Exam" : "Next Question"} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// --- SUMMARIZER TOOL ---

const SummarizerTool: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'bullet' | 'paragraph' | 'eli5'>('bullet');

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    const result = await generateSummary(text, mode);
    setSummary(result);
    setIsLoading(false);
  };

  const pasteClipboard = async () => {
      try {
          const text = await navigator.clipboard.readText();
          setText(text);
      } catch (err) {
          console.error("Failed to paste", err);
      }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-end">
            <div>
                <h3 className="text-lg font-bold text-text">Input Text</h3>
                <p className="text-xs text-gray-500">Paste articles, notes, or chat logs.</p>
            </div>
            <button onClick={pasteClipboard} className="text-xs flex items-center text-primary hover:underline">
                <ClipboardPaste className="w-3 h-3 mr-1"/> Paste
            </button>
        </div>
        <div className="flex-1 relative">
            <textarea
            className="w-full h-full bg-background border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:outline-none resize-none font-mono text-sm min-h-[300px]"
            placeholder="Paste your content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            ></textarea>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
             {(['bullet', 'paragraph', 'eli5'] as const).map(m => (
                <button 
                    key={m} 
                    onClick={() => setMode(m)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {m === 'eli5' ? 'ELI5 (Simple)' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
            ))}
        </div>
        <Button 
            className="w-full" 
            size="lg"
            onClick={handleSummarize} 
            isLoading={isLoading} 
            disabled={!text.trim()}
        >
            Summarize Text
        </Button>
      </div>
      
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-center h-[42px]">
             <h3 className="text-lg font-bold text-text">Summary</h3>
             {summary && (
                 <button 
                    onClick={() => navigator.clipboard.writeText(summary)}
                    className="text-xs flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                 >
                     <Copy className="w-3 h-3 mr-2"/> Copy
                 </button>
             )}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-y-auto min-h-[400px]">
          {summary ? (
            <MarkdownRenderer content={summary} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 opacity-20" />
               </div>
               <p className="text-sm font-medium">Summary will appear here</p>
               <p className="text-xs opacity-50">Select a mode and click summarize</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PLANNER TOOL ---

const PlannerTool: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(3);
  const [intensity, setIntensity] = useState('Medium');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlan = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    const result = await generateStudyPlan(topic, days, intensity);
    setPlan(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface border border-gray-200 dark:border-gray-700 p-8 rounded-3xl mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-text mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-primary"/> 
            Create Study Plan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic / Subject</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Organic Chemistry, SAT Math"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Duration (Days)</label>
            <input 
              type="number" 
              min={1} 
              max={30}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Intensity</label>
             <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
             >
                <option value="Light">Light (1-2 hrs)</option>
                <option value="Medium">Medium (3-4 hrs)</option>
                <option value="Heavy">Heavy (5+ hrs)</option>
             </select>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
             <Button onClick={handlePlan} isLoading={isLoading} disabled={!topic} className="w-full md:w-auto px-8 py-3">
                <Sparkles className="w-4 h-4 mr-2"/>
                Generate Plan
             </Button>
        </div>
      </div>

      {plan && (
        <div className="bg-background rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="prose dark:prose-invert max-w-none prose-table:border-collapse prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700">
            <MarkdownRenderer content={plan} />
          </div>
        </div>
      )}
    </div>
  );
};

// --- HISTORY TOOL ---

const HistoryTool: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSessionPreview[]>([]);

  useEffect(() => {
    const rawHistory = localStorage.getItem('thinkmate_chat_history');
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory);
        // Map to preview
        setSessions(parsed.map((s: any) => ({
            id: s.id,
            timestamp: s.timestamp || Date.now(),
            summary: s.messages.length > 1 ? s.messages[s.messages.length - 1].text.substring(0, 100) + '...' : 'Empty Chat',
            messageCount: s.messages.length
        })).reverse());
      } catch (e) {
        console.error("Error reading history", e);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-text mb-6 flex items-center">
            <History className="w-6 h-6 mr-2 text-primary"/> 
            Chat History
        </h3>
        
        {sessions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500">No chat history found. Start a conversation in the Chat tab!</p>
            </div>
        ) : (
            <div className="space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-background p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <div className="font-bold text-text">Session {new Date(session.timestamp).toLocaleDateString()}</div>
                             <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">{session.messageCount} msgs</span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2">{session.summary}</p>
                        <div className="mt-4 text-xs text-gray-400">
                            {new Date(session.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

// --- VIDEO ANALYSIS TOOL ---

const VideoAnalysisTool: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('Analyze this video and list key educational takeaways.');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleAnalyze = async () => {
        if (!videoFile) return;
        setIsLoading(true);
        setResult('');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const mimeType = videoFile.type;
            const text = await analyzeVideo(base64Data, mimeType, prompt);
            setResult(text);
            setIsLoading(false);
        };
        reader.readAsDataURL(videoFile);
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-surface border border-gray-200 dark:border-gray-700 p-6 rounded-3xl">
                     <h3 className="text-xl font-bold text-text mb-4">Upload Video</h3>
                     <div 
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                     >
                        <input type="file" ref={fileRef} accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                        {videoFile ? (
                            <div className="flex flex-col items-center">
                                <Film className="w-10 h-10 text-primary mb-2" />
                                <span className="font-bold text-text">{videoFile.name}</span>
                                <span className="text-xs text-gray-500">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Upload className="w-10 h-10 mb-2" />
                                <span>Click to upload video</span>
                                <span className="text-xs mt-1">MP4, WebM (Max 20MB rec.)</span>
                            </div>
                        )}
                     </div>
                </div>

                <div className="bg-surface border border-gray-200 dark:border-gray-700 p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-text mb-4">Prompt</h3>
                    <textarea 
                        className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none h-32 resize-none"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button onClick={handleAnalyze} disabled={!videoFile || isLoading} className="w-full mt-4">
                        {isLoading ? "Analyzing..." : "Analyze Video (Gemini 3 Pro)"}
                    </Button>
                </div>
            </div>

            <div className="bg-surface border border-gray-200 dark:border-gray-700 p-6 rounded-3xl min-h-[500px] overflow-y-auto">
                <h3 className="text-xl font-bold text-text mb-4">Analysis Result</h3>
                {result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <MonitorPlay className="w-12 h-12 mb-4 opacity-20" />
                        <p>Upload a video to see insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- IMAGE EDITOR TOOL ---

const ImageEditorTool: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState<'free' | 'object-removal' | 'filter' | 'style'>('free');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setResultImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async () => {
        let finalPrompt = prompt;
        if (mode === 'object-removal') finalPrompt = `Remove the ${prompt} from the image and fill in the background seamlessly.`;
        if (mode === 'filter') finalPrompt = `Apply a ${prompt} filter to this image.`;
        if (mode === 'style') finalPrompt = `Transfer the style of ${prompt} to this image.`;

        if (!selectedImage || !finalPrompt.trim()) return;
        
        setIsLoading(true);
        const base64Data = selectedImage.split(',')[1];
        const resultBase64 = await editImageWithGemini(base64Data, finalPrompt);
        
        if (resultBase64) {
            setResultImage(`data:image/png;base64,${resultBase64}`);
        } else {
            alert("Failed to edit image.");
        }
        setIsLoading(false);
    }

    return (
        <div className="max-w-6xl mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[650px]">
                {/* Left: Input */}
                <div className="flex flex-col h-full bg-surface border border-gray-200 dark:border-gray-700 rounded-3xl p-4">
                    <div className="flex justify-between items-center mb-4 px-2">
                         <h3 className="font-bold text-text flex items-center">
                            <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                            Original Image
                        </h3>
                        {selectedImage && (
                            <button onClick={() => setSelectedImage(null)} className="text-xs text-red-500 hover:underline">Clear</button>
                        )}
                    </div>
                    
                    <div 
                        onClick={() => !selectedImage && fileInputRef.current?.click()}
                        className={`flex-1 rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden relative group ${selectedImage ? 'bg-black' : 'border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                    >
                        {selectedImage ? (
                            <>
                                <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <p className="text-white font-medium flex items-center"><Upload className="w-5 h-5 mr-2" /> Replace</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <span className="text-gray-500 font-medium">Click to upload photo</span>
                                <span className="text-gray-400 text-xs mt-2">JPG, PNG supported</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                    </div>

                    <div className="mt-4 space-y-3">
                        {/* Mode Selection */}
                        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            <button onClick={() => setMode('free')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'free' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}>Free Edit</button>
                            <button onClick={() => setMode('object-removal')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'object-removal' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}>Remove Obj</button>
                            <button onClick={() => setMode('filter')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'filter' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}>Filters</button>
                             <button onClick={() => setMode('style')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'style' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}>Style</button>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                {mode === 'free' && "Instruction"}
                                {mode === 'object-removal' && "What object to remove?"}
                                {mode === 'filter' && "Filter Name (e.g. Vintage, B&W)"}
                                {mode === 'style' && "Style (e.g. Van Gogh, Cyberpunk)"}
                             </label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="..."
                                    className="flex-1 bg-background border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                                />
                                <Button onClick={() => handleEdit()} disabled={!selectedImage || !prompt} isLoading={isLoading}>
                                    <Wand2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Output */}
                <div className="flex flex-col h-full bg-surface border border-gray-200 dark:border-gray-700 rounded-3xl p-4">
                     <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-text flex items-center">
                            <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
                            Edited Result
                        </h3>
                        {resultImage && (
                             <a 
                                href={resultImage} 
                                download="thinkmate-edit.png"
                                className="text-xs flex items-center text-primary hover:underline"
                            >
                                <Download className="w-3 h-3 mr-1" /> Save
                            </a>
                        )}
                     </div>
                     <div className="flex-1 bg-background/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
                        {isLoading ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                                </div>
                                <span className="text-text font-medium">AI is editing...</span>
                            </div>
                        ) : resultImage ? (
                            <div className="relative w-full h-full bg-black flex items-center justify-center">
                                <img src={resultImage} alt="Edited" className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 p-8">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="w-10 h-10 opacity-20" />
                                </div>
                                <p className="font-medium">Edited image will appear here</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- IMAGE GENERATOR TOOL ---

const ImageGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedImage(null);
    const result = await generateImageFromPrompt(prompt, size);
    if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
    } else {
        alert("Failed to generate image. Please try again (You may need to select a Paid API Key).");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 p-8 rounded-3xl mb-8 border border-pink-100 dark:border-pink-800/30">
        <h3 className="text-xl font-bold text-text mb-6 flex items-center">
            <ImagePlus className="w-6 h-6 mr-2 text-pink-500"/> 
            Creative Image Studio
        </h3>
        
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                <textarea
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none h-24"
                  placeholder="e.g. A futuristic city floating in the clouds, cyberpunk style, high detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Resolution</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value as any)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:outline-none appearance-none"
                    >
                        <option value="1K">1K (Standard)</option>
                        <option value="2K">2K (High Res)</option>
                        <option value="4K">4K (Ultra HD)</option>
                    </select>
                </div>
                <Button 
                    onClick={handleGenerate} 
                    isLoading={isLoading} 
                    disabled={!prompt.trim()} 
                    className="w-full sm:w-2/3 py-3 bg-pink-600 hover:bg-pink-700 text-white border-none ring-pink-500"
                >
                    <Sparkles className="w-4 h-4 mr-2"/>
                    Generate Image (Gemini 3 Pro)
                </Button>
            </div>
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-gray-200 dark:border-gray-700 min-h-[400px] flex items-center justify-center p-4 overflow-hidden relative">
          {isLoading ? (
             <div className="flex flex-col items-center">
                 <div className="w-16 h-16 border-4 border-pink-200 dark:border-pink-900 rounded-full animate-spin border-t-pink-500 mb-4"></div>
                 <p className="text-gray-500 font-medium">Creating masterpiece...</p>
             </div>
          ) : generatedImage ? (
             <div className="relative w-full h-full flex items-center justify-center group">
                 <img src={generatedImage} alt="Generated" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
                 <a 
                    href={generatedImage} 
                    download={`generated-${Date.now()}.png`}
                    className="absolute top-4 right-4 bg-white/90 text-gray-900 px-4 py-2 rounded-xl shadow-xl font-medium flex items-center hover:bg-white transition-all transform opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                 >
                    <Download className="w-4 h-4 mr-2" /> Download
                 </a>
             </div>
          ) : (
             <div className="text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImagePlus className="w-10 h-10 opacity-20" />
                </div>
                <p>Enter a prompt to generate an image</p>
             </div>
          )}
      </div>
    </div>
  );
};

// --- VIDEO GENERATOR TOOL ---

const VideoGeneratorTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleGenerate = async () => {
      if (!prompt.trim()) return;
      setIsLoading(true);
      setVideoUrl(null);
      setErrorMsg(null);
      
      const result = await generateVideoFromPrompt(prompt, aspectRatio);
      
      if (typeof result === 'string') {
          setVideoUrl(result);
      } else if (result && typeof result === 'object' && 'error' in result) {
          setErrorMsg(result.error);
      } else {
          setErrorMsg("Failed to generate video. Please try again later.");
      }
      setIsLoading(false);
    };
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 p-8 rounded-3xl mb-8 border border-violet-100 dark:border-violet-800/30">
          <h3 className="text-xl font-bold text-text mb-6 flex items-center">
              <Video className="w-6 h-6 mr-2 text-violet-500"/> 
              AI Video Production (Veo)
          </h3>
          
          <div className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prompt</label>
                  <textarea
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none h-24"
                    placeholder="e.g. A neon hologram of a cat driving at top speed, cinematic lighting..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Aspect Ratio</label>
                      <select
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value as any)}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:outline-none appearance-none"
                      >
                          <option value="16:9">Landscape (16:9)</option>
                          <option value="9:16">Portrait (9:16)</option>
                      </select>
                  </div>
                  <Button 
                      onClick={handleGenerate} 
                      isLoading={isLoading} 
                      disabled={!prompt.trim()} 
                      className="w-full sm:w-2/3 py-3 bg-violet-600 hover:bg-violet-700 text-white border-none ring-violet-500"
                  >
                      <MonitorPlay className="w-4 h-4 mr-2"/>
                      Generate Video (Veo 3.1)
                  </Button>
              </div>
          </div>
        </div>
  
        <div className="bg-surface rounded-3xl border border-gray-200 dark:border-gray-700 min-h-[400px] flex items-center justify-center p-4 overflow-hidden relative">
            {isLoading ? (
               <div className="flex flex-col items-center">
                   <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 rounded-full animate-spin border-t-violet-500 mb-4"></div>
                   <p className="text-gray-500 font-medium">Veo is rendering... (This may take a minute)</p>
               </div>
            ) : videoUrl ? (
               <div className="w-full max-w-3xl animate-in fade-in">
                   <video 
                      controls 
                      autoPlay 
                      loop 
                      className="w-full rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
                      src={videoUrl}
                   >
                       Your browser does not support the video tag.
                   </video>
                   <div className="mt-4 flex justify-end">
                        <a 
                        href={videoUrl} 
                        download={`veo-video-${Date.now()}.mp4`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text px-4 py-2 rounded-xl font-medium flex items-center transition-colors"
                        >
                        <Download className="w-4 h-4 mr-2" /> Download MP4
                        </a>
                   </div>
               </div>
            ) : errorMsg ? (
                <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">Generation Failed</h3>
                    <p className="text-gray-500">{errorMsg}</p>
                    <button onClick={() => setErrorMsg(null)} className="mt-4 text-primary hover:underline">Try Again</button>
                </div>
            ) : (
               <div className="text-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-10 h-10 opacity-20" />
                  </div>
                  <p>Enter a prompt to create a video</p>
               </div>
            )}
        </div>
      </div>
    );
  };