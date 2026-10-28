import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/chakra-petch/latin-700.css';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import { App } from './app/App';
import { redirectPathToHash } from './app/router';
import { GameProvider } from './state/GameContext';
import { GameStore } from './state/store';

redirectPathToHash(import.meta.env.BASE_URL);

const store = new GameStore();
void store.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider store={store}>
      <App />
    </GameProvider>
  </StrictMode>,
);
