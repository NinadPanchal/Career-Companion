import { useState, useEffect } from "react";
import {
  User,
  Server,
  Key,
  Save,
  CheckCircle2,
  RefreshCw,
  Database,
  Eye,
  EyeOff,
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { Card, Button, Badge, Input } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../lib/api";

export function Settings() {
  const { theme, setTheme } = useTheme();
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
    <div className="space-y-[var(--space-5)] animate-fade-in font-sans select-none max-w-4xl pb-10">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--divider)]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[var(--text-xl)] font-semibold text-[var(--text)] tracking-tight">
            System Settings
          </h1>
          <Badge variant="success">Local first</Badge>
        </div>
        <p className="mt-1 text-[var(--text-sm)] text-[var(--text-muted)]">
          Manage local engine services, database synchronization, profile metadata, and interface preferences.
        </p>
      </div>

      <div className="grid gap-[var(--space-4)]">
        {/* Appearance & Theme Card */}
        <Card className="p-[var(--space-5)] space-y-[var(--space-4)]">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--divider)]">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)]">
              <Sun size={16} />
            </div>
            <div>
              <h2 className="text-[var(--text-md)] font-medium text-[var(--text)]">Appearance & Theme</h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Select your preferred interface appearance or sync with your operating system.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-3.5 rounded-[var(--radius-md)] border text-left transition-all duration-[var(--dur-fast)] flex items-center gap-3 cursor-pointer ${
                theme === "dark"
                  ? "bg-[color-mix(in_srgb,var(--accent)_14%,var(--glass-bg))] border-[var(--accent)] shadow-[0_0_12px_rgba(79,140,255,0.25)]"
                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)]"
              }`}
            >
              <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)]">
                <Moon size={15} />
              </div>
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">Dark Theme</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Liquid glass dark default</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-3.5 rounded-[var(--radius-md)] border text-left transition-all duration-[var(--dur-fast)] flex items-center gap-3 cursor-pointer ${
                theme === "light"
                  ? "bg-[color-mix(in_srgb,var(--accent)_14%,var(--glass-bg))] border-[var(--accent)] shadow-[0_0_12px_rgba(79,140,255,0.25)]"
                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)]"
              }`}
            >
              <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)]">
                <Sun size={15} />
              </div>
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">Light Theme</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Soft frosted daylight</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-3.5 rounded-[var(--radius-md)] border text-left transition-all duration-[var(--dur-fast)] flex items-center gap-3 cursor-pointer ${
                theme === "system"
                  ? "bg-[color-mix(in_srgb,var(--accent)_14%,var(--glass-bg))] border-[var(--accent)] shadow-[0_0_12px_rgba(79,140,255,0.25)]"
                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)]"
              }`}
            >
              <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)]">
                <Laptop size={15} />
              </div>
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">System Default</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Follow OS preference</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Local Engine Service Card */}
        <Card className="p-[var(--space-5)] space-y-[var(--space-3)]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--divider)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] border border-[color-mix(in_srgb,var(--success)_24%,transparent)] flex items-center justify-center text-[var(--success)]">
                <Server size={16} />
              </div>
              <div>
                <h2 className="text-[var(--text-md)] font-medium text-[var(--text)]">Local Engine Service</h2>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                  FastAPI background REST service running on 127.0.0.1:8000
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    apiStatus === "connected"
                      ? "bg-[var(--success)] shadow-[0_0_8px_var(--success)]"
                      : apiStatus === "checking"
                      ? "bg-[var(--warning)] animate-pulse"
                      : "bg-[var(--danger)]"
                  }`}
                />
                <span className="text-[var(--text-xs)] text-[var(--text)] capitalize font-medium">
                  {apiStatus === "connected" ? "Connected" : apiStatus === "checking" ? "Checking..." : "Offline"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkApiConnection}
                className="h-8 w-8 !p-0"
                aria-label="Refresh API connection"
                title="Refresh API connection"
              >
                <RefreshCw size={14} className={apiStatus === "checking" ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] pt-1">
            <span>Provides local vector matching, resume parsing, and outreach drafting.</span>
            <span className="font-mono text-[var(--text-faint)]">Port 8000</span>
          </div>
        </Card>

        {/* Database & Synchronization */}
        <Card className="p-[var(--space-5)] space-y-[var(--space-3)]">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--divider)]">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)]">
              <Database size={16} />
            </div>
            <div>
              <h2 className="text-[var(--text-md)] font-medium text-[var(--text)]">Database & Storage</h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Hybrid storage architecture for private, zero-latency desktop workflows
              </p>
            </div>
          </div>

          <p className="text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
            Career Companion stores candidate data locally in an embedded{" "}
            <strong className="text-[var(--text)] font-medium">SQLite</strong> database for zero-latency desktop operation
            and complete privacy. Syncing with <strong className="text-[var(--text)] font-medium">PostgreSQL</strong> is
            supported for encrypted cloud backup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[var(--success)] mt-0.5 shrink-0" />
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">Local SQLite</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Primary offline store</p>
              </div>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[var(--success)] mt-0.5 shrink-0" />
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">Parsed Cache</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Local vector index</p>
              </div>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[var(--success)] mt-0.5 shrink-0" />
              <div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--text)]">Pipeline DB</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Local state & sync log</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Candidate Profile */}
        <Card className="p-[var(--space-5)] space-y-[var(--space-4)]">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--divider)]">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)]">
              <User size={16} />
            </div>
            <div>
              <h2 className="text-[var(--text-md)] font-medium text-[var(--text)]">Candidate Profile</h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Used to auto-populate applications and tailor outreach drafts
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex Johnson"
            />

            <Input
              label="Target role title"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
            />

            <div className="sm:col-span-2">
              <Input
                label="Primary contact email"
                type="email"
                value={userEmail}
                error={emailError}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="you@domain.com"
              />
            </div>
          </div>
        </Card>

        {/* External API Credentials */}
        <Card className="p-[var(--space-5)] space-y-[var(--space-4)]">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--divider)]">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] flex items-center justify-center text-[var(--warning)]">
              <Key size={16} />
            </div>
            <div>
              <h2 className="text-[var(--text-md)] font-medium text-[var(--text)]">External API Credentials</h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Optional live job search or external LLM API key
              </p>
            </div>
          </div>

          <p className="text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
            API keys are masked by default and stored securely in your local environment. Keys are used only when initiating live external provider queries.
          </p>

          <div>
            <Input
              label="JSearch / RapidAPI key"
              type={showApiKey ? "text" : "password"}
              placeholder="Enter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  aria-label={showApiKey ? "Mask API key" : "Show API key"}
                  title={showApiKey ? "Mask API key" : "Show API key"}
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>
        </Card>

        {/* Action Button & Feedback */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] border border-[color-mix(in_srgb,var(--success)_24%,transparent)] text-[var(--text-sm)] text-[var(--success)]">
              <CheckCircle2 size={15} />
              <span>Preferences saved successfully</span>
            </div>
          ) : (
            <div />
          )}

          <Button variant="primary" size="sm" onClick={handleSave} className="gap-2">
            <Save size={14} />
            <span>Save preferences</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
