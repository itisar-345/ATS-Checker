import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster 
      position="top-right" 
      richColors 
      theme="dark"
      toastOptions={{
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: '#e9d5ff'
        }
      }}
    />
  </BrowserRouter>
);

export default App;