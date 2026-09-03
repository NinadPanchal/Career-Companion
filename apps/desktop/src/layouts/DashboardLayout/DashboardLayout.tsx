import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useThemeStore } from "../../stores/theme.store";

function DashboardLayout() {
    const theme = useThemeStore((s) => s.theme);

    let bgClass = "bg-[#030712]"; // default midnight OLED
    if (theme === "deepspace") bgClass = "bg-[#0b0f19]";
    else if (theme === "emerald") bgClass = "bg-[#06120e]";
    else if (theme === "cyber") bgClass = "bg-[#050814]";

    return (
        <div className={`flex min-h-screen ${bgClass} text-white transition-colors duration-300`}>
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;