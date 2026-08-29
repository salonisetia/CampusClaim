import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <footer className="w-full bg-slate-950 text-slate-400 py-6 px-6 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} CampusClaim • Real-Time Community Recovery Protocol</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;