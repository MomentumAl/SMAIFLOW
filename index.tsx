import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LegalPageView from './components/LegalPageView';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from './legalContent';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const legalPages: Record<string, string> = {
    '/terms': TERMS_OF_SERVICE,
    '/privacy': PRIVACY_POLICY,
};

const Main = () => {
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
      const handleHashChange = () => {
        setHash(window.location.hash);
      };

      window.addEventListener('hashchange', handleHashChange, false);
      return () => {
        window.removeEventListener('hashchange', handleHashChange, false);
      };
    }, []);

    const hashPath = (hash.substring(1) || '/').toLowerCase();

    if (legalPages[hashPath]) {
        return <LegalPageView content={legalPages[hashPath]} />;
    }

    return <App />;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
