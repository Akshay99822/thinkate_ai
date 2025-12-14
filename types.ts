export type Role = 'user' | 'model' | 'system';

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachment?: Attachment; // Generic file (PDF, TXT, Image, Video)
  timestamp: number;
  isAudioPlaying?: boolean; // For UI state
}

export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'neon' | 'pastel';
export type FontFamily = 'Inter' | 'Comic Neue' | 'Poppins' | 'Merriweather' | 'Fira Code';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type UIStyle = 'minimal' | 'glass' | 'neon' | 'standard';

export interface AppTheme {
  isDarkMode: boolean;
  colorTheme: ThemeColor;
  fontFamily: FontFamily;
  fontSize: FontSize;
  uiStyle: UIStyle;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface ChatSessionPreview {
  id: string;
  timestamp: number;
  summary: string;
  messageCount: number;
}