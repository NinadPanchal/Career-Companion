import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Career Companion</h2>

            <nav>
                <ul className="sidebar-nav">
                    <li><Link to="/dashboard">🏠 Dashboard</Link></li>
                    <li><Link to="/resume">📄 Resume</Link></li>
                    <li><Link to="/jobs">💼 Jobs</Link></li>
                    <li><Link to="/settings">⚙️ Settings</Link></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;