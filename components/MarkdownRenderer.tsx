import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none text-text">
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className="bg-gray-800 text-gray-100 rounded-md p-4 my-2 overflow-x-auto text-sm font-mono">
                {children}
              </div>
            ) : (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1: ({children}) => <h1 className="text-2xl font-bold text-primary mt-4 mb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-bold text-primary mt-3 mb-2">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-bold text-secondary mt-3 mb-1">{children}</h3>,
          p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-secondary pl-4 italic my-2 text-gray-600 dark:text-gray-400">{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};