import { ShieldCheck, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-16 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <ShieldCheck className="text-indigo-400 w-6 h-6" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">CampusClaim</span>
          <span className="ml-2 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono">v1.0</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
        <Link to="/" className="hover:text-indigo-400 text-white transition">Dashboard</Link>
        <a href="#stats" className="hover:text-indigo-400 transition">Analytics</a>
      </div>
    </nav>
  );
}