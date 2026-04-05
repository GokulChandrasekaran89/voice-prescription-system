import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        🎤 <span>V-Prescription</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/add-patient"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🎤 Add Patient
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
