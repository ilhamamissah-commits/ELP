/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { unlockAudio } from './services/audioEngine'

// Unlock audio on ANY click on the entire page
window.addEventListener('click', unlockAudio, { once: true });
window.addEventListener('touchstart', unlockAudio, { once: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode removed because it cancels Web Speech API audio in development
  <App />
)