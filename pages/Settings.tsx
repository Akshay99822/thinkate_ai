import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColor, FontFamily, FontSize, UIStyle } from '../types';
import { THEME_PRESETS } from '../constants';
import { Palette, Type, Monitor, Layout, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setColorTheme, setFontFamily, setFontSize, setUIStyle, toggleDarkMode } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-text mb-4">Customize Your Experience</h1>
        <p className="text-lg text-gray-500">
            Make Study Buddy feel like home. Adjust colors, fonts, and styles to match your learning vibe.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Color Theme */}
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary"><Palette className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-text">Color Palette</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {Object.keys(THEME_PRESETS).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setColorTheme(colorKey as ThemeColor)}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${theme.colorTheme === colorKey ? 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}
              >
                <div 
                    className="w-12 h-12 rounded-full shadow-sm mb-2 flex items-center justify-center"
                    style={{ backgroundColor: THEME_PRESETS[colorKey].primary }}
                >
                    {theme.colorTheme === colorKey && <Check className="w-6 h-6 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-500 capitalize">{colorKey}</span>
              </button>
            ))}
          </div>
        </div>

        {/* UI Style */}
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary"><Layout className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-text">Visual Style</h2>
          </div>
          <div className="space-y-3">
             {(['standard', 'minimal', 'glass', 'neon'] as UIStyle[]).map((style) => (
                 <button
                    key={style}
                    onClick={() => setUIStyle(style)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        theme.uiStyle === style 
                        ? 'border-primary bg-primary/5 text-primary font-bold' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary/50'
                    }`}
                 >
                    <span className="capitalize">{style} Mode</span>
                    {theme.uiStyle === style && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                 </button>
             ))}
          </div>
        </div>

        {/* Appearance (Dark Mode) */}
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary"><Monitor className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-text">Brightness</h2>
          </div>
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => !theme.isDarkMode && toggleDarkMode()}
                className={`flex items-center p-3 rounded-xl border ${theme.isDarkMode ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
             >
                 <span className="w-4 h-4 bg-gray-900 rounded-full mr-3 border border-gray-600"></span>
                 Dark Mode
             </button>
             <button 
                onClick={() => theme.isDarkMode && toggleDarkMode()}
                className={`flex items-center p-3 rounded-xl border ${!theme.isDarkMode ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
             >
                 <span className="w-4 h-4 bg-white rounded-full mr-3 border border-gray-300"></span>
                 Light Mode
             </button>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary"><Type className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-text">Typography</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Font Family</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Inter', 'Comic Neue', 'Poppins', 'Merriweather', 'Fira Code'] as FontFamily[]).map((font) => (
                    <button
                      key={font}
                      onClick={() => setFontFamily(font)}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-all ${theme.fontFamily === font ? 'bg-primary text-white shadow-md' : 'bg-background hover:bg-gray-100 dark:hover:bg-gray-700 text-text'}`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Text Size</label>
                 <div className="flex items-center space-x-2 bg-background p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button onClick={() => setFontSize('normal')} className={`flex-1 p-2 rounded-lg text-center ${theme.fontSize === 'normal' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-gray-400'}`}>
                      <span className="text-sm">Aa (Normal)</span>
                    </button>
                    <button onClick={() => setFontSize('large')} className={`flex-1 p-2 rounded-lg text-center ${theme.fontSize === 'large' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-gray-400'}`}>
                      <span className="text-base">Aa (Large)</span>
                    </button>
                     <button onClick={() => setFontSize('xlarge')} className={`flex-1 p-2 rounded-lg text-center ${theme.fontSize === 'xlarge' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-gray-400'}`}>
                      <span className="text-xl">Aa (Extra)</span>
                    </button>
                 </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};