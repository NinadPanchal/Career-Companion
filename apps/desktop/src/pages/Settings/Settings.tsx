import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";

function Settings() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-zinc-400">
          Manage your Career Companion preferences.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-zinc-400">
            Update your personal information and resume preferences.
          </p>
          <Button className="mt-6">Edit Profile</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="mt-2 text-zinc-400">
            Control job alerts and AI recommendation notifications.
          </p>
          <Button variant="secondary" className="mt-6">
            Notification Settings
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Account</h2>
          <p className="mt-2 text-zinc-400">
            Manage your account, connected services, and security.
          </p>
          <Button variant="ghost" className="mt-6">
            Manage Account
          </Button>
        </Card>
      </div>
    </main>
  );
}

export default Settings;