import './index.css';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import AppContextProvider from './Context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContextProvider>
);