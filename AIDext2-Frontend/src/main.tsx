//import { StrictMode } from 'react'
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
