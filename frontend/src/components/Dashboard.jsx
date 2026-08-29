import { useState, useEffect } from "react";
import { Search, Plus, MapPin, Calendar, Mail, Tag, AlertTriangle, CheckCircle2, Check, Sparkles } from "lucide-react";
import PostItemModal from "./PostItemModal";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Filter States (Same as SafeNeighbor)
  const [activeTab, setActiveTab] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch Items function using standard Fetch API
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/get_items`);
      const data = await response.json();
      if (response.ok) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle item status between Active and Claimed
  const toggleStatus = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/api/verify_item/${itemId}`, {
        method: "PATCH"
      });
      if (response.ok) {
        const updated = await response.json();
        setItems(prev => prev.map(item => item._id === itemId ? updated : item));
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // Client-Side Filtering (Exactly how you did in SafeNeighbor Dashboard.jsx)
  const filteredItems = items.filter(item => {
    const tabMatch = activeTab === "All" || item.type === activeTab;
    const categoryMatch = categoryFilter === "All" || item.category === categoryFilter;
    const searchMatch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && categoryMatch && searchMatch;
  });

  const getCategoryPlaceholder = (category) => {
    switch (category) {
      case "Electronics":
        return "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80";
      case "Cards & IDs":
        return "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80";
      case "Books & Stationery":
        return "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80";
      default:
        return "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80";
    }
  };

  const totalReported = items.length;
  const activeLost = items.filter(i => i.type === "Lost" && i.status === "Active").length;
  const recoveredCount = items.filter(i => i.status === "Claimed").length;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pt-20 px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Metrics */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
                <Sparkles size={14} /> Campus-Wide Recovery Protocol
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Campus Asset Tracker</h1>
              <p className="text-sm text-slate-400 mt-1">Track and claim lost belongings across departments.</p>
            </div>
            
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              <Plus size={16} /> Post Item Report
            </button>
          </div>

          <div id="stats" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <Tag className="text-indigo-400" size={20} />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Reports</p>
                <p className="text-xl font-bold font-mono text-white">{totalReported}</p>
              </div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <AlertTriangle className="text-rose-400" size={20} />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Lost</p>
                <p className="text-xl font-bold font-mono text-white">{activeLost}</p>
              </div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Resolved Cases</p>
                <p className="text-xl font-bold font-mono text-white">{recoveredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {["All", "Lost", "Found"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search item, room, lab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Cards & IDs">Cards & IDs</option>
              <option value="Personal Items">Personal Items</option>
              <option value="Books & Stationery">Books & Stationery</option>
            </select>
          </div>
        </div>

        {/* Items Cards */}
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center text-slate-500">
            <p className="text-sm font-medium">No items match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-950">
                    <img
                      src={item.image && item.image.trim() !== "" ? item.image : getCategoryPlaceholder(item.category)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase ${
                        item.type === "Lost" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[11px] bg-slate-950/80 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>
                    {item.status === "Claimed" && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                        <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Check size={16} /> Recovered
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-slate-100 text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{item.description}</p>
                    <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-slate-500" /><span>{item.location}</span></div>
                      <div className="flex items-center gap-2"><Calendar size={13} className="text-slate-500" /><span>{item.date}</span></div>
                      <div className="flex items-center gap-2"><Mail size={13} className="text-slate-500" /><span className="font-mono text-slate-300">{item.contact}</span></div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => toggleStatus(item._id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
                  >
                    {item.status === "Active" ? "Mark as Recovered" : "Reopen Case"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onItemAdded={fetchData}
      />
    </div>
  );
}