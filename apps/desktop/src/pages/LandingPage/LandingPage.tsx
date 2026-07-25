import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

function LandingPage() {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/dashboard");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
                <h1 className="mb-3 text-5xl font-bold text-emerald-400">
                    🚀 Career Companion
                </h1>
                
                <h2 className="mb-8 text-zinc-300">
                    AI-Powered Career Assistant
                </h2>

                <Button onClick={handleClick}>
                    Get Started →
                </Button>
            </div>
        </main>
    );
};
export default LandingPage;