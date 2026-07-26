import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Home,
  User,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
          <>
            <div>
              <h2 className="sidebar-title">Career Companion</h2>
              <p className="sidebar-subtitle">AI Career Assistant</p>

              <nav>
                <ul className="sidebar-nav">
                  <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                      <Home size={18} />
                      <span>Home</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/resume" className={({ isActive }) => isActive ? "active" : ""}>
                      <FileText size={18} />
                      <span>Resume</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""}>
                      <Briefcase size={18} />
                      <span>Jobs</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
                      <Settings size={18} />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                <User size={20} />
              </div>
              <div>
                <p className="sidebar-name">Ninad Panchal</p>
                <p className="sidebar-role">AI & DS Student</p>
              </div>
            </div>
          </>
        </aside>
    );
}

export default Sidebar;