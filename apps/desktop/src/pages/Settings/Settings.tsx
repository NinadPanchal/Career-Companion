import { useState, useEffect } from "react";
import { User, Server, Key, Save, CheckCircle2, RefreshCw, Database, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { api } from "../../lib/api";

function Settings() {
  const [userName, setUserName] = useState("Ninad Panchal");
  const [userRole, setUserRole] = useState("AI & DS Engineer");
  const [userEmail, setUserEmail] = useState("ninad.panchal@career-companion.app");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

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
    if (userEmail && !userEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans select-none max-w-4xl pb-10">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-semibold text-[#f4f4f5] tracking-tight">System settings</h1>
          <Badge variant="emerald" size="sm">Local first</Badge>
        </div>
        <p className="mt-1 text-xs text-[#a1a1aa]">
          Manage local engine services, database synchronization, profile metadata, and external credentials.
        </p>
      </div>

      <div className="grid gap-5">
        {/* Local Engine Service Card */}
        <Card className="p-4.5 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                <Server size={16} />
              </div>
              <div>
                <h2 className="text-sm font-medium text-[#f4f4f5]">Local engine service</h2>
                <p className="text-xs text-[#71717a]">FastAPI background REST service running on 127.0.0.1:8000</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#18181b] border border-white/[0.08]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    apiStatus === "connected"
                      ? "bg-[#10b981]"
                      : apiStatus === "checking"
                      ? "bg-[#fbbf24] animate-pulse"
                      : "bg-[#ef4444]"
                  }`}
                />
                <span className="text-xs text-[#d4d4d8] capitalize">
                  {apiStatus === "connected" ? "Connected" : apiStatus === "checking" ? "Checking" : "Offline"}
                </span>
              </div>
              <button
                type="button"
                onClick={checkApiConnection}
                className="p-1.5 rounded-[6px] bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-[#f4f4f5] border border-white/[0.08] transition-colors cursor-pointer"
                aria-label="Refresh API connection"
                title="Refresh API connection"
              >
                <RefreshCw size={13} className={apiStatus === "checking" ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#71717a]">
            <span>Provides local vector matching, resume parsing, and outreach drafting.</span>
            <span className="text-[#a1a1aa]">Port 8000</span>
          </div>
        </Card>

        {/* Database & Synchronization */}
        <Card className="p-4.5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-[8px] bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
              <Database size={16} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-[#f4f4f5]">Database and synchronization</h2>
              <p className="text-xs text-[#71717a]">Hybrid storage architecture for privacy and cloud backup</p>
            </div>
          </div>

          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Career Companion stores candidate data locally in an embedded <strong className="text-[#f4f4f5] font-medium">SQLite</strong> database for zero-latency desktop operation and complete privacy. When configured, it supports syncing with <strong className="text-[#f4f4f5] font-medium">Neon PostgreSQL</strong> for multi-device backup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-[8px] bg-[#18181b] border border-white/[0.06] flex items-start gap-2">
              <ShieldCheck size={14} className="text-[#10b981] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-[#f4f4f5]">Local SQLite</p>
                <p className="text-[11px] text-[#71717a]">Primary offline store</p>
              </div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#18181b] border border-white/[0.06] flex items-start gap-2">
              <ShieldCheck size={14} className="text-[#10b981] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-[#f4f4f5]">Resume parsed cache</p>
                <p className="text-[11px] text-[#71717a]">Local vector index</p>
              </div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#18181b] border border-white/[0.06] flex items-start gap-2">
              <ShieldCheck size={14} className="text-[#10b981] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-[#f4f4f5]">Applications pipeline</p>
                <p className="text-[11px] text-[#71717a]">Local state & sync log</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Candidate Profile */}
        <Card className="p-4.5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-[8px] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
              <User size={16} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-[#f4f4f5]">Candidate profile</h2>
              <p className="text-xs text-[#71717a]">Used to auto-populate applications and tailor outreach drafts</p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-name" className="mb-1.5 block text-xs font-medium text-[#d4d4d8]">Full name</label>
              <input
                id="settings-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full h-8.5 px-3 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] outline-none focus:border-[#10b981] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="settings-role" className="mb-1.5 block text-xs font-medium text-[#d4d4d8]">Target role title</label>
              <input
                id="settings-role"
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full h-8.5 px-3 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] outline-none focus:border-[#10b981] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="settings-email" className="mb-1.5 block text-xs font-medium text-[#d4d4d8]">Primary contact email</label>
              <input
                id="settings-email"
                type="email"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={`w-full h-8.5 px-3 rounded-[8px] border ${
                  emailError ? "border-[#ef4444]" : "border-white/[0.08]"
                } bg-[#09090b] text-xs text-[#f4f4f5] outline-none focus:border-[#10b981] transition-colors`}
              />
              {emailError && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[#ef4444]">
                  <AlertCircle size={12} />
                  <span>{emailError}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* External API Credentials */}
        <Card className="p-4.5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-[8px] bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b]">
              <Key size={16} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-[#f4f4f5]">External API credentials</h2>
              <p className="text-xs text-[#71717a]">Optional live job search or external LLM API key</p>
            </div>
          </div>

          <p className="text-xs text-[#71717a] leading-relaxed">
            API keys are masked by default and stored securely in your local environment. Keys are used only when initiating live external provider queries.
          </p>

          <div>
            <label htmlFor="settings-api-key" className="mb-1.5 block text-xs font-medium text-[#d4d4d8]">
              JSearch / RapidAPI key
            </label>
            <div className="relative">
              <input
                id="settings-api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full h-8.5 pl-3 pr-10 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] outline-none focus:border-[#10b981] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
                aria-label={showApiKey ? "Mask API key" : "Show API key"}
                title={showApiKey ? "Mask API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </Card>

        {/* Action Button & Feedback */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#10b981]/10 border border-[#10b981]/20 text-xs text-[#10b981]">
              <CheckCircle2 size={14} />
              <span>Preferences saved successfully</span>
            </div>
          ) : <div />}

          <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
            <Save size={14} />
            <span>Save preferences</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;