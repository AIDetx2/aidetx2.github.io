// AIDetx2 - Web interface for AI-generated text detection.
// Copyright (C) 2026 Diogo Silva
// Licensed under the GNU GPL-3.0-or-later.
// See the LICENSE file for details.
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ModeProvider } from "./context/ModeContext";

{/* <StrictMode>
  <Navbar/>
  <TextScanner />
  <Home/>
</StrictMode>, */}

{/* <StrictMode>
    <App/>
  </StrictMode> */}

createRoot(document.getElementById('root')!).render(
  <ModeProvider>
    <App />
  </ModeProvider>
)
