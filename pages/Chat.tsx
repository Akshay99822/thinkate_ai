import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Mic, Paperclip, X, StopCircle, Volume2, FileText, Play, Brain, BookOpen } from 'lucide-react';
import { Message, Attachment } from '../types';
import { generateResponse, transcribeAudio, generateSpeech } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Button } from '../components/Button';
import { SAMPLE_QUESTIONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Hi! I'm ThinkMate. Ask me anything, upload a PDF/Image, or send a voice note!",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Session ID for history tracking
  const sessionId = useRef<string>(Date.now().toString());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    saveToHistory();
  }, [messages]);

  const saveToHistory = () => {
      // Save current session to local storage
      const currentSession = {
          id: sessionId.current,
          timestamp: Date.now(),
          messages: messages
      };
      
      const rawHistory = localStorage.getItem('thinkmate_chat_history');
      let history = rawHistory ? JSON.parse(rawHistory) : [];
      
      // Update existing session or add new
      const index = history.findIndex((s: any) => s.id === sessionId.current);
      if (index >= 0) {
          history[index] = currentSession;
      } else {
          history.push(currentSession);
      }
      
      localStorage.setItem('thinkmate_chat_history', JSON.stringify(history));
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if ((!textToSend.trim() && !attachment) || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      attachment: attachment || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    const tempAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);

    try {
      const aiResponseText = await generateResponse(newUserMessage.text, messages, tempAttachment || undefined);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: "Sorry, I encountered a connection error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setAttachment({
            name: file.name,
            mimeType: file.type,
            data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
             const base64Audio = (reader.result as string).split(',')[1];
             setIsLoading(true);
             const tempId = Date.now().toString();
             setMessages(prev => [...prev, {
                 id: tempId,
                 role: 'user',
                 text: "🎤 Audio Message...",
                 timestamp: Date.now()
             }]);
             
             const transcription = await transcribeAudio(base64Audio);
             
             setMessages(prev => prev.map(m => m.id === tempId ? {...m, text: `🎤 "${transcription}"`} : m));

             if (transcription) {
                 const aiText = await generateResponse(transcription, messages);
                 setMessages(prev => [...prev, {
                     id: (Date.now() + 1).toString(),
                     role: 'model',
                     text: aiText,
                     timestamp: Date.now()
                 }]);
             }
             setIsLoading(false);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playTTS = async (text: string, msgId: string) => {
      // If already playing, could stop. For simplicity, we just play new one.
      setIsLoading(true);
      const audioBase64 = await generateSpeech(text);
      setIsLoading(false);

      if (audioBase64) {
          const audioUrl = `data:audio/wav;base64,${audioBase64}`;
          if (audioPlayerRef.current) {
              audioPlayerRef.current.src = audioUrl;
              audioPlayerRef.current.play();
              // Update state to show playing icon could be added here
          }
      }
  };

  const QuickAction = ({icon, label, prompt}: {icon: React.ReactNode, label: string, prompt: string}) => (
      <button 
        onClick={() => handleSendMessage(prompt)}
        className="flex items-center space-x-1 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg text-xs font-medium transition-colors"
      >
        {icon}
        <span>{label}</span>
      </button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background relative">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm group ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-surface text-text border border-gray-100 dark:border-gray-800 rounded-tl-none'
            }`}>
              
              {/* Attachment Display */}
              {msg.attachment && (
                <div className="mb-3 p-2 bg-black/10 rounded-lg flex items-center space-x-2">
                    {msg.attachment.mimeType.startsWith('image') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="attachment" className="max-w-full h-32 object-cover rounded" />
                    ) : msg.attachment.mimeType.startsWith('video') ? (
                         <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center"><Play size={12} className="text-white"/></div>
                            <span className="text-sm truncate max-w-[150px]">{msg.attachment.name}</span>
                         </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <FileText size={20} />
                            <span className="text-sm truncate max-w-[150px] font-mono">{msg.attachment.name}</span>
                        </div>
                    )}
                </div>
              )}

              {msg.role === 'model' ? (
                <div>
                    <MarkdownRenderer content={msg.text} />
                    <button 
                        onClick={() => playTTS(msg.text, msg.id)}
                        className="mt-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        title="Read Aloud"
                    >
                        <Volume2 size={16} />
                    </button>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-surface p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions / Quick Actions */}
      <div className="px-4 pb-2">
         {messages.length === 1 && (
            <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
                {SAMPLE_QUESTIONS.map((q, i) => (
                <button 
                    key={i}
                    onClick={() => setInput(q)} 
                    className="whitespace-nowrap px-4 py-2 bg-surface hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors"
                >
                    {q}
                </button>
                ))}
            </div>
         )}
         {messages.length > 1 && !isLoading && (
             <div className="flex justify-center gap-3 pb-2">
                 <QuickAction icon={<BookOpen size={14}/>} label="Summarize Chat" prompt="Summarize our conversation so far in bullet points." />
                 <QuickAction icon={<Brain size={14}/>} label="Quiz Me" prompt="Create a short quiz based on what we just discussed." />
                 <QuickAction icon={<FileText size={14}/>} label="Create Plan" prompt="Create a study plan based on this topic." />
             </div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-gray-200 dark:border-gray-800">
        {attachment && (
          <div className="mb-2 relative inline-flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
             <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] mr-2">{attachment.name}</span>
            <button 
              onClick={() => setAttachment(null)}
              className="bg-gray-200 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-end space-x-2 max-w-7xl mx-auto">
           {/* File Upload */}
          <input 
            type="file" 
            accept="image/*,video/*,.pdf,.txt,.md,.doc,.docx" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title="Upload File"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isRecording ? "Listening..." : "Ask a question..."}
              className="w-full bg-transparent border-none p-3 max-h-32 resize-none focus:ring-0 text-text placeholder-gray-400"
              rows={1}
            />
          </div>

          {/* Mic Button */}
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={(!input.trim() && !attachment) || isLoading || isRecording}
            className="rounded-xl px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};