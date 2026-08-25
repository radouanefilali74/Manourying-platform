import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// The website's tokens, imported rather than copied — see the alias in
// vite.config.ts for why.
import '@tokens';
import './styles/admin.css';

import { App } from './App.tsx';

const root = document.getElementById('root');
if (!root) throw new Error('#root is missing from index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
