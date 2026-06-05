import { useState } from "react";
import { KeyRound, Copy, Check } from "lucide-react";

export default function Settings() {
  const [copied, setCopied] = useState(false);

  const seedCmd = `curl -X POST /api/admin/seed \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@site.com","password":"yourpassword","secret":"<SESSION_SECRET>"}'`;

  function copy() {
    navigator.clipboard.writeText(seedCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account and configuration.</p>
      </div>

      {/* Seed admin */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#07082a15" }}>
            <KeyRound className="w-5 h-5" style={{ color: "#07082a" }} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Create Admin Account</h2>
            <p className="text-sm text-gray-500">Run this once to set up your first admin user.</p>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto font-mono leading-relaxed">{seedCmd}</pre>
          <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Replace <code className="bg-gray-100 px-1 rounded text-gray-600">&lt;SESSION_SECRET&gt;</code> with your SESSION_SECRET environment variable value.
          This endpoint only works once — if an admin already exists, it returns 409.
        </p>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Important</p>
        <p>Keep your SESSION_SECRET safe — it's used to sign admin JWT tokens. Rotate it to invalidate all active sessions.</p>
      </div>
    </div>
  );
}
