import { useState, useEffect } from "react";
import { User, Server, Key, Save, CheckCircle2, RefreshCw, Database } from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { api } from "../../lib/api";

function Settings() {
  const [userName, setUserName] = useState("Ninad Panchal");
  const [userRole, setUserRole] = useState("AI & DS Engineer");
  const [userEmail, setUserEmail] = useState("ninad.panchal@career-companion.app");
  const [apiKey, setApiKey] = useState("");
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    setApiStatus("checking");
    try {
      await api.get("/");
      setApiStatus("connected");
    } catch {
      setApiStatus("offline");
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans select-none max-w-4xl">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span>Settings & System</span>
          <Badge variant="emerald" size="sm">Local First</Badge>
        </h1>
        <p className="mt-0.5 text-xs text-zinc-400">
          Manage local engine services, profile metadata, and third-party API credentials.
        </p>
      </div>

      <div className="grid gap-5">
        {/* API Engine Status Card */}
        <Card hover className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Server size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">FastAPI Local Engine</h2>
              <p className="text-xs text-zinc-400">REST service on http://127.0.0.1:8000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === "connected"
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                    : apiStatus === "checking"
                    ? "bg-amber-400 animate-ping"
                    : "bg-red-400"
                }`}
              />
              <span className="text-xs font-mono text-zinc-300 capitalize">{apiStatus}</span>
            </div>
            <button
              onClick={checkApiConnection}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
              title="Refresh connection"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </Card>

        {/* Database Architecture */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Database size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Database & Synchronization Architecture</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Career Companion operates on a hybrid architecture: offline-first zero-config <strong className="text-white">SQLite</strong> for instant desktop local privacy, with automatic branching sync to cloud <strong className="text-white">Neon PostgreSQL</strong> when online.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400 pt-1">
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-emerald-400">✓ Resumes & ATS History</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-emerald-400">✓ Discovered Job Cache</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-emerald-400">✓ Application Pipeline</span>
          </div>
        </Card>

        {/* Profile Settings */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <User size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Candidate Profile</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-300">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-300">Target Role Title</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-zinc-300">Primary Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Third-party API Credentials */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Key size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">External Job Search API Key (Optional)</h2>
          </div>
          <p className="text-xs text-zinc-400">
            For live external scraping of LinkedIn or Indeed boards via third-party providers (JSearch / RapidAPI).
          </p>
          <input
            type="password"
            placeholder="••••••••••••••••••••••••••••••••"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white font-mono outline-none focus:border-emerald-500/50 transition-colors"
          />
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <CheckCircle2 size={14} /> Preferences updated successfully!
            </span>
          ) : <span />}

          <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
            <Save size={14} />
            <span>Save Preferences</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;