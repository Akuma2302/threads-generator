import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import BokehBackground from './components/BokehBackground.jsx';
import './components/BokehBackground.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BokehBackground />
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
