import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";

function Jobs() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Jobs</h1>
          <p className="mt-2 text-zinc-400">
            Browse AI-matched opportunities.
          </p>
        </div>

        <Button>Find Jobs</Button>
      </div>

      <div className="grid gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">AI/ML Intern</h2>
              <p className="text-zinc-400">OpenAI • Remote</p>
            </div>
            <Button variant="secondary">Apply</Button>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Data Analyst Intern</h2>
              <p className="text-zinc-400">Google • Bengaluru</p>
            </div>
            <Button variant="secondary">Apply</Button>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Software Engineer Intern</h2>
              <p className="text-zinc-400">Microsoft • Hyderabad</p>
            </div>
            <Button variant="secondary">Apply</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Jobs; 