import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";
import { useThemeStore } from "../../stores/theme.store";

function DashboardLayout() {
    const theme = useThemeStore((s) => s.theme);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    let bgClass = "bg-[#030712]"; // default midnight OLED
    if (theme === "deepspace") bgClass = "bg-[#0b0f19]";
    else if (theme === "emerald") bgClass = "bg-[#06120e]";
    else if (theme === "cyber") bgClass = "bg-[#050814]";

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCommandPaletteOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={`flex min-h-screen ${bgClass} text-white transition-colors duration-300`}>
            <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
            />
        </div>
    );
}

export default DashboardLayout;