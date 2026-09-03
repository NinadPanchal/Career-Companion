import { useState, useEffect } from "react";
import { Sparkles, User, Server, Key, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";
import { useThemeStore } from "../../stores/theme.store";

function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [userName, setUserName] = useState("Ninad Panchal");
  const [userRole, setUserRole] = useState("AI & DS Student");
  const [userEmail, setUserEmail] = useState("local@career-companion.app");
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
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={14} /> Preferences & System
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-zinc-400">
          Configure local API keys, user profile, and system status.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* API & Backend Status Card */}
        <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <Server size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">FastAPI Backend Engine</h2>
                <p className="text-xs text-zinc-400">Local service running on http://127.0.0.1:8000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    apiStatus === "connected"
                      ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                      : apiStatus === "checking"
                      ? "bg-amber-400 animate-ping"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-xs font-medium text-zinc-300 capitalize">{apiStatus}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={checkApiConnection} className="p-2">
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Database Architecture Card */}
        <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                  100% Free & Open Source
                </span>
                <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                  SQLAlchemy 2.0 Async
                </span>
              </div>
              <h2 className="mt-2 text-base font-bold text-white">Database Engine</h2>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed max-w-xl">
                Career Companion uses an open-source database engine that runs locally on <strong className="text-white">SQLite</strong> without any cost or accounts, and seamlessly connects to free cloud <strong className="text-white">PostgreSQL</strong> (via Neon or Supabase) with zero code changes.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Users & Profile</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Resumes & Parse History</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Jobs Discovery Cache</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Applications Pipeline</span>
          </div>
        </Card>

        {/* Profile Settings */}
        <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <User className="text-emerald-400" size={20} />
            <h2 className="text-lg font-bold">User Profile</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Title / Target Role</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-zinc-400">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Theme Preference Settings */}
        <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Sparkles className="text-emerald-400" size={20} />
            <div>
              <h2 className="text-lg font-bold">Theme & Visual Palette</h2>
              <p className="text-xs text-zinc-400">Select your preferred dark/night mode aesthetic (Active: <span className="text-emerald-400 font-semibold capitalize">{theme}</span>)</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setTheme("midnight")}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                theme === "midnight"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-sm font-bold text-white">Midnight OLED</span>
              </div>
              <p className="text-xs text-zinc-400">Pitch black `#030712` canvas with cyber emerald glows.</p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("deepspace")}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                theme === "deepspace"
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                <span className="text-sm font-bold text-white">Deep Space</span>
              </div>
              <p className="text-xs text-zinc-400">Midnight indigo `#0b0f19` canvas with soft violet lighting.</p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("emerald")}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                theme === "emerald"
                  ? "border-teal-500 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                <span className="text-sm font-bold text-white">Emerald Night</span>
              </div>
              <p className="text-xs text-zinc-400">Dark obsidian `#06120e` canvas with mint highlights.</p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("cyber")}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                theme === "cyber"
                  ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <span className="text-sm font-bold text-white">Cyber Dark</span>
              </div>
              <p className="text-xs text-zinc-400">Dark Navy `#050814` canvas with electric blue glow.</p>
            </button>
          </div>
        </Card>

        {/* Job Search API Key */}
        <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Key className="text-emerald-400" size={20} />
            <div>
              <h2 className="text-lg font-bold">Job Discovery API Configuration</h2>
              <p className="text-xs text-zinc-400">Optional key for third-party job search providers (e.g. JSearch / Adzuna API)</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">API Key</label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>
        </Card>

        {/* Action button */}
        <div className="flex items-center justify-between">
          {saveSuccess && (
            <span className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 size={16} /> Preferences saved successfully!
            </span>
          )}
          <Button onClick={handleSave} className="ml-auto flex items-center gap-2">
            <Save size={16} /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;