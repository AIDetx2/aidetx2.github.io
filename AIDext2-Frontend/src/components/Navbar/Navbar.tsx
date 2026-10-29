// AIDetx2 - Web interface for AI-generated text detection.
// Copyright (C) 2026 Diogo Silva
// Licensed under the GNU GPL-3.0-or-later.
// See the LICENSE file for details.
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useMode } from "../../context/ModeContext";
import { GrPersonalComputer } from "react-icons/gr";
import { AiOutlineCloudServer } from "react-icons/ai";



const NAV_LINKS = [
  { label: "Detector", to: "/" },
  { label: "Documentation", to: "/docs" },
  { label: "Models", to: "/models" },
];

function ModeSwitch() {
  const { useLocal, setUseLocal } = useMode();
  return (
    <div className="navbar-mode-switch">
      <span className={`mode-label ${useLocal ? "active" : ""}`}>
        <GrPersonalComputer />
        <span>Local</span>
      </span>

      <label className="switch">
        <input
          type="checkbox"
          checked={!useLocal}
          onChange={() => setUseLocal(u => !u)}
          aria-label="Toggle between local and backend mode"
        />
        <span className="slider"></span>
      </label>

      <span className={`mode-label ${!useLocal ? "active" : ""}`}>
        <AiOutlineCloudServer />
        <span>Backend</span>
      </span>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  //const { useLocal, setUseLocal } = useMode();
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);


  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          AIDetx<span className="navbar-logo-accent">2</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={`navbar-link ${isActive(link.to) ? "active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop switch */}
        <ModeSwitch />

        {/* Hamburger: now a direct child of navbar-inner */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`ham-line ${menuOpen ? "ham-line--open-1" : ""}`} />
          <span className={`ham-line ${menuOpen ? "ham-line--open-2" : ""}`} />
          <span className={`ham-line ${menuOpen ? "ham-line--open-3" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar-link ${isActive(link.to) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ModeSwitch />
        </div>
      )}
    </nav>
  );
}