import { useEffect, useState } from "react";
import { Users, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { api, type Lead, type ChatSession } from "@/lib/api";

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "15" }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getLeads(), api.getChatSessions()])
      .then(([l, s]) => { setLeads(l); setSessions(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const today = new Date().toDateString();
  const todayLeads = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Leads" value={leads.length} color="#07082a" />
          <StatCard icon={Clock} label="New Leads" value={newLeads} color="#f5c518" />
          <StatCard icon={TrendingUp} label="Today's Leads" value={todayLeads} color="#22c55e" />
          <StatCard icon={MessageSquare} label="Chat Sessions" value={sessions.length} color="#8b5cf6" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Leads</h2>
            <a href="/leads" className="text-xs font-semibold" style={{ color: "#f5c518" }}>View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="px-6 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs" style={{ background: "#07082a15", color: "#07082a" }}>
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{lead.name}</p>
                  <p className="text-xs text-gray-400 truncate">{lead.email ?? lead.phone ?? "No contact"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lead.status === "new" ? "bg-green-50 text-green-700" : lead.status === "contacted" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No leads yet. They'll appear here after forms are submitted.</p>
            )}
          </div>
        </div>

        {/* Recent Chat Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Chat Sessions</h2>
            <a href="/chat" className="text-xs font-semibold" style={{ color: "#f5c518" }}>View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.sessionId} className="px-6 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#8b5cf615" }}>
                  <MessageSquare className="w-4 h-4" style={{ color: "#8b5cf6" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Session {s.sessionId.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">{s.messageCount} messages</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(s.lastMessage).toLocaleDateString()}</span>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No chat sessions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
