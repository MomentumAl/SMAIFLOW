import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PricingModal from './PricingModal';
import FeedbackModal from './FeedbackModal';

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

  flushList();
  return elements;
};


interface Props {
  content: string;
}

const LegalPageView: React.FC<Props> = ({ content }) => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fix: Add a handler for the onShowLegal prop required by the Footer component.
  // This will navigate to the correct legal page.
  const handleShowLegal = (type: 'terms' | 'privacy') => {
    window.location.hash = `/${type}`;
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    const isDark = theme === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundImage = "url('https://iili.io/KjSxR0G.jpg')";
    } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundImage = "url('https://iili.io/KjJFkmb.jpg')";
    }
  }, []);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-lg border border-amber-300/40">
          {parseAndRenderContent(content)}
        </div>
      </main>
      <Footer 
        onShowFeedback={() => setShowFeedbackModal(true)} 
        onShowPricing={() => setShowPricingModal(true)}
        onShowLegal={handleShowLegal}
      />
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
    </div>
  );
};

export default LegalPageView;