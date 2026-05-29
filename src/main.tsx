import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global error and unhandledrejection handlers to swallow external browser extension / MetaMask errors
if (typeof window !== 'undefined') {
  const isExtensionError = (message: string): boolean => {
    if (!message) return false;
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('metamask') ||
      lowerMessage.includes('websocket closed') ||
      lowerMessage.includes('wallet') ||
      lowerMessage.includes('extension')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason) {
      const reasonStr = typeof reason === 'string' ? reason : (reason.message || String(reason));
      if (isExtensionError(reasonStr)) {
        event.preventDefault();
        console.warn('Suppressed external MetaMask/extension promise rejection:', reasonStr);
      }
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (isExtensionError(message)) {
      event.preventDefault();
      console.warn('Suppressed external MetaMask/extension runtime error:', message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
