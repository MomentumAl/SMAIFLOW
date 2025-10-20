import React from 'react';

interface Props {
  title: string;
  content: string;
  onClose: () => void;
}

const parseAndRenderContent = (text: string) => {
  const lines = text.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const renderInlineFormatting = (line: string): React.ReactNode => {
    const parts = line.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-slate-900 dark:text-slate-100">{part}</strong>;
      }
      return part;
    });
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-outside pl-5 space-y-2 my-4">
          {listItems.map((item, index) => (
            <li key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed">{renderInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">{line.substring(3)}</h1>);
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">{line.substring(2)}</h2>);
    } else if (line.startsWith('- ')) {
      // If the previous line wasn't a list item, flush any other elements
      if (index > 0 && !lines[index - 1].startsWith('- ')) {
        flushList();
      }
      listItems.push(line.substring(2));
    } else if (line.startsWith('!!!') && line.endsWith('!!!')) {
      flushList();
      elements.push(
        <div key={index} className="my-4 p-4 bg-red-50 dark:bg-red-500/20 border-l-4 border-red-500 rounded-r-md">
          <p className="font-semibold text-red-800 dark:text-red-200">{renderInlineFormatting(line.slice(3, -3))}</p>
        </div>
      );
    } else if (line.trim() !== '') {
      flushList();
      elements.push(<p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{renderInlineFormatting(line)}</p>);
    }
  });

  flushList(); // Ensure the last list is rendered
  return elements;
};


const LegalModal: React.FC<Props> = ({ title, content, onClose }) => {
  const legalUrl = title.toLowerCase().includes('términos') ? '#/terms' : '#/privacy';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl animate-fade-in-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-amber-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-amber-950 dark:text-slate-100">{title}</h2>
              <a 
                href={legalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-amber-600 hover:underline dark:text-amber-400 mt-1 inline-block"
              >
                Ver en página dedicada ↗
              </a>
            </div>
            <button onClick={onClose} className="p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 overflow-y-auto">
            {parseAndRenderContent(content)}
        </div>
        
        <div className="p-4 bg-amber-50/60 dark:bg-slate-900/50 border-t border-amber-200 dark:border-slate-700 rounded-b-2xl flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;