import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Phone, Mail, MessageSquare, Search, Users } from "lucide-react";
import { api, type Lead } from "@/lib/api";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed"];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  function load() {
    setLoading(true);
    api.getLeads().then(setLeads).catch(console.error).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: number, status: string) {
    await api.updateLeadStatus(id, status);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead?")) return;
    await api.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || (l.email ?? "").toLowerCase().includes(q) || (l.phone ?? "").includes(q);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 flex gap-6 min-h-full">
      {/* Main list */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 text-sm mt-0.5">{leads.length} total · {leads.filter(l => l.status === "new").length} new</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 transition" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="space-y-px">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No leads found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Source</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === lead.id ? "bg-yellow-50" : ""}`}
                    onClick={() => setSelected(selected?.id === lead.id ? null : lead)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: "#07082a15", color: "#07082a" }}>
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        {lead.email && <div className="flex items-center gap-1 text-gray-500"><Mail className="w-3 h-3" />{lead.email}</div>}
                        {lead.phone && <div className="flex items-center gap-1 text-gray-500"><Phone className="w-3 h-3" />{lead.phone}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{lead.source}</td>
                    <td className="px-5 py-3.5">
                      <select value={lead.status ?? "new"} onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:ring-2 focus:ring-yellow-200 cursor-pointer ${
                          lead.status === "new" ? "bg-green-50 text-green-700" :
                          lead.status === "contacted" ? "bg-blue-50 text-blue-700" :
                          lead.status === "qualified" ? "bg-purple-50 text-purple-700" :
                          "bg-gray-100 text-gray-500"}`}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 sticky top-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: "#f5c51830", color: "#07082a" }}>
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{selected.name}</h3>
                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              {selected.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline truncate">{selected.email}</a>
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${selected.phone}`} className="text-gray-700 hover:underline">{selected.phone}</a>
                </div>
              )}
              {selected.message && (
                <div className="flex gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 leading-relaxed">{selected.message}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${selected.status === s ? "text-navy" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    style={selected.status === s ? { background: "#f5c518", color: "#07082a" } : {}}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => deleteLead(selected.id)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl py-2.5 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete Lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


