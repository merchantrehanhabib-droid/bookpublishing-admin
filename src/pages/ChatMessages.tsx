import { useEffect, useState } from "react";
import { Trash2, RefreshCw, MessageSquare } from "lucide-react";
import { api, type ChatSession } from "@/lib/api";

export default function ChatMessages() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ChatSession | null>(null);

  function load() {
    setLoading(true);
    api.getChatSessions().then(setSessions).catch(console.error).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function deleteSession(sessionId: string) {
    if (!confirm("Delete this chat session?")) return;
    await api.deleteChatSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    if (selected?.sessionId === sessionId) setSelected(null);
  }

  return (
    <div className="p-8 flex gap-6 min-h-full">
      {/* Sessions list */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chat Sessions</h1>
          <button onClick={load} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No chat sessions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div key={s.sessionId}
                onClick={() => setSelected(s)}
                className={`bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all ${
                  selected?.sessionId === s.sessionId ? "border-yellow-300 shadow-yellow-100" : "border-gray-100"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#8b5cf615" }}>
                      <MessageSquare className="w-4 h-4" style={{ color: "#8b5cf6" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Session {s.sessionId.slice(0, 8)}</p>
                      <p className="text-xs text-gray-400">{s.messageCount} messages</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteSession(s.sessionId); }} className="text-gray-200 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{new Date(s.lastMessage).toLocaleString()}</p>
                {s.messages[s.messages.length - 1] && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    <span className="font-medium">{s.messages[s.messages.length - 1].from === "user" ? "User" : "Sarah"}:</span>{" "}
                    {s.messages[s.messages.length - 1].text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages panel */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#07082a10" }}>
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">Select a session to view messages</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-gray-900">Session {selected.sessionId.slice(0, 8)}</h2>
                <p className="text-xs text-gray-400">{selected.messageCount} messages · {new Date(selected.lastMessage).toLocaleString()}</p>
              </div>
              <button onClick={() => deleteSession(selected.sessionId)} className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: "#f9fafb" }}>
              {[...selected.messages].reverse().map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.from === "agent" && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0" style={{ background: "#07082a", color: "#f5c518" }}>S</div>
                  )}
                  <div className={`max-w-xs xl:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "rounded-br-sm text-navy font-medium"
                      : "bg-white shadow-sm rounded-bl-sm text-gray-700 border border-gray-100"
                  }`}
                    style={msg.from === "user" ? { background: "#f5c518", color: "#07082a" } : {}}>
                    {msg.text}
                    <p className="text-xs opacity-50 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
