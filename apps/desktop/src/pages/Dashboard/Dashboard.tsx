import "./Dashboard.css";

import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";

function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <Card hover className="max-w-3xl">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="mt-2 text-zinc-400">
          Welcome back to Career Companion.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-zinc-800 p-4">
            <p className="text-zinc-400">Resume Score</p>
            <h2 className="mt-2 text-2xl font-bold">87%</h2>
          </div>

          <div className="rounded-xl bg-zinc-800 p-4">
            <p className="text-zinc-400">Jobs Found</p>
            <h2 className="mt-2 text-2xl font-bold">24</h2>
          </div>

          <div className="rounded-xl bg-zinc-800 p-4">
            <p className="text-zinc-400">Applications</p>
            <h2 className="mt-2 text-2xl font-bold">6</h2>
          </div>
        </div>

        <Button className="mt-8" size="lg">
          Continue Browsing
        </Button>
      </Card>
    </main>
  );
}

export default Dashboard;