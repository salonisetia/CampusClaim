import { useState } from "react";
import { X } from "lucide-react";

export default function PostItemModal({ isOpen, onClose, onItemAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "Lost",
    category: "Electronics",
    location: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    contact: "",
    image: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/post_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Report Submitted Successfully!");
        if (onItemAdded) onItemAdded();
        onClose();
        setFormData({
          title: "",
          type: "Lost",
          category: "Electronics",
          location: "",
          date: new Date().toISOString().split('T')[0],
          description: "",
          contact: "",
          image: ""
        });
      } else {
        alert("Failed to post report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white">Log Item Incident</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dell XPS Laptop"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Incident Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none"
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Cards & IDs">Cards & IDs</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Location Details *</label>
            <input
              type="text"
              required
              placeholder="e.g. Library 2nd floor silent zone"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contact Email / Phone *</label>
            <input
              type="text"
              required
              placeholder="e.g. contact@campus.edu"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Identifying Notes</label>
            <textarea
              rows="2"
              placeholder="Color, marks, stickers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 rounded-xl text-xs text-slate-300 font-semibold">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
              {isSubmitting ? "Publishing..." : "Publish Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}