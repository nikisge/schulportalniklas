"use client";
import { useState, useEffect, useCallback } from "react";

// Default demo data for 3 days
const DEFAULT_DATA = {
  day0: [
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Mi", art: "Entfall", fach_alt: "G11", raum_alt: "D314", hinweis: "; Entfall" },
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Shü", art: "Entfall", fach_alt: "G12", raum_alt: "D306", hinweis: "; Entfall" },
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Sef", art: "Entfall", fach_alt: "G15", raum_alt: "C114", hinweis: "; Entfall" },
    { stunde: "8 - 9", klasse: "Q1/2", lehrkraft: "Sgl", art: "Entfall", fach_alt: "PoWi13", raum_alt: "D204", hinweis: "; Verlegung von Schneesportwoche II" },
    { stunde: "8 - 9", klasse: "Q1/2", lehrkraft: "Weh", art: "Entfall", fach_alt: "PoWi16", raum_alt: "D303", hinweis: "; Entfall" },
    { stunde: "8 - 9", klasse: "Q1/2", lehrkraft: "Htl", art: "Entfall", fach_alt: "PoWi15", raum_alt: "D213", hinweis: "; Entfall" },
  ],
  day1: [
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Nev", art: "Entfall", fach_alt: "Eth13", raum_alt: "B209", hinweis: "; Verlegung von Schneesportwoche II" },
    { stunde: "5 - 6", klasse: "Q1/2", vertreter: "Gü", lehrkraft: "Gü", art: "Raum-Vtr.", fach: "DSp11", raum: "C116", raum_alt: "Aula", hinweis: "; Verlegung von Generalprobe Streichmusiker" },
    { stunde: "5 - 6", klasse: "Q1/2", vertreter: "Ed", lehrkraft: "Ed", art: "Raum-Vtr.", fach: "Mu11", raum: "C106", raum_alt: "C001", hinweis: "" },
    { stunde: "8 - 9", klasse: "Q1/2", lehrkraft: "Sgl", art: "Entfall", fach_alt: "M01", raum_alt: "D314", hinweis: "; Verlegung von Schneesportwoche II" },
    { stunde: "8 - 9", klasse: "Q1/2", lehrkraft: "Bhn", art: "Entfall", fach_alt: "M15", raum_alt: "D305", hinweis: "; Verlegung von Schneesportwoche II" },
    { stunde: "10 - 11", klasse: "Q1/2", lehrkraft: "Hoh", art: "Entfall", fach_alt: "F15", raum_alt: "C104", hinweis: "; Verlegung von Schneesportwoche II" },
  ],
  day2: [
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Sgl", art: "Entfall", fach_alt: "PoWi13", raum_alt: "D204", hinweis: "; Verlegung von Schneesportwoche II" },
    { stunde: "1 - 2", klasse: "Q1/2", lehrkraft: "Mar", art: "Entfall", fach_alt: "PoWi05", raum_alt: "D306", hinweis: "; Entfall" },
    { stunde: "3 - 4", klasse: "Q1/2", lehrkraft: "Su", art: "Entfall", fach_alt: "BioNW205", raum_alt: "D510", hinweis: "; Verlegung von Entfall für Lehrer" },
    { stunde: "3 - 4", klasse: "Q1/2", lehrkraft: "Mü", art: "Entfall", fach_alt: "BioNW216", raum_alt: "D512", hinweis: "; Verlegung von Entfall für Lehrer" },
    { stunde: "3 - 4", klasse: "Q1/2", lehrkraft: "Kue", art: "Entfall", fach_alt: "Q1Ch-NW2-14", raum_alt: "D504", hinweis: "; Verlegung von Entfall für Lehrer" },
    { stunde: "3 - 4", klasse: "Q1/2", vertreter: "Scm", lehrkraft: "Scm", art: "Unterricht geändert", fach: "PhNW205", raum: "D402", hinweis: "Klausur Ph" },
    { stunde: "3 - 4", klasse: "Q1/2", vertreter: "Geb", lehrkraft: "Geb", art: "Unterricht geändert", fach: "PhNW212", raum: "D404", hinweis: "Klausur Ph" },
  ],
};

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function getSchoolDays() {
  const today = new Date();
  const days = [];
  let d = new Date(today);

  // If weekend, jump to Monday
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  if (d.getDay() === 6) d.setDate(d.getDate() + 2);

  for (let i = 0; i < 3; i++) {
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatDateShort(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

function getDayLabel(date) {
  const today = new Date();
  const todayStr = today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === todayStr) return "heute";
  if (date.toDateString() === tomorrow.toDateString()) return "morgen";
  return null;
}

function getNow() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${formatDate(now)} um ${hh}:${mm}:${ss} Uhr`;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [data, setData] = useState(DEFAULT_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mounted, setMounted] = useState(false);

  const days = getSchoolDays();

  // Load custom entries from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("schulportal_custom_entries");
      if (stored) {
        const custom = JSON.parse(stored);
        const merged = { ...DEFAULT_DATA };
        for (const key of ["day0", "day1", "day2"]) {
          if (custom[key] && custom[key].length > 0) {
            merged[key] = [...DEFAULT_DATA[key], ...custom[key]];
          }
        }
        setData(merged);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for storage changes (from admin page)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "schulportal_custom_entries") {
        try {
          const custom = e.newValue ? JSON.parse(e.newValue) : { day0: [], day1: [], day2: [] };
          const merged = { ...DEFAULT_DATA };
          for (const key of ["day0", "day1", "day2"]) {
            if (custom[key] && custom[key].length > 0) {
              merged[key] = [...DEFAULT_DATA[key], ...custom[key]];
            }
          }
          setData(merged);
        } catch (e) {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const closeDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, [closeDropdowns]);

  const dayKey = `day${activeDay}`;
  const entries = data[dayKey] || [];
  const filtered = searchTerm
    ? entries.filter((e) =>
        Object.values(e).some((v) =>
          v && String(v).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : entries;

  if (!mounted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Lade...</p>
      </div>
    );
  }

  return (
    <>
      {/* Top bar - Schulportal */}
      <div className="navbar-first desktop-only">
        <div className="container">
          <span className="brand-text">Schulportal<sup>HESSEN</sup></span>
        </div>
      </div>

      {/* School header */}
      <div id="headlogo" className="desktop-only">
        <div className="container">
          <div className="head-inner">
            <div className="school-logo-img">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <div>
              <p className="headtitle">Humboldtschule <small>Bad Homburg</small></p>
              <div className="head-subtitle">&quot;Schulportal Hessen - Pädagogische Organisation&quot;</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="navbar-main">
        <div className="container">
          {/* Mobile header */}
          <div className="mobile-header mobile-only">
            <a className="mobile-brand" href="#">Humboldtschule</a>
            <button
              className="navbar-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          {/* Nav links */}
          <ul className={`nav-left ${mobileMenuOpen ? "show" : ""}`}>
            <li><a href="#"><i className="fa fa-home"></i> Start</a></li>
            <li className={`dropdown ${openDropdown === "apps" ? "open" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "apps" ? null : "apps");
                }}
              >
                <i className="fa fa-bars"></i> Apps <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><i className="fa fa-calendar"></i> Kalender</a></li>
                <li><a href="#"><i className="fa fa-exchange-alt"></i> Vertretungsplan</a></li>
                <li><a href="#"><i className="fa fa-envelope"></i> Nachrichten</a></li>
                <li><a href="#"><i className="fa fa-book"></i> Mein Unterricht</a></li>
                <li><a href="#"><i className="fa fa-clipboard"></i> Klausurplan</a></li>
              </ul>
            </li>
          </ul>

          <ul className={`nav-right ${mobileMenuOpen ? "show" : ""}`}>
            <li className={`dropdown ${openDropdown === "user" ? "open" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "user" ? null : "user");
                }}
              >
                <i className="fa-solid fa-child"></i> Hansen, Niklas (Q2-He) <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><i className="fa fa-key"></i> Passwort ändern</a></li>
                <li><a href="#"><i className="fa fa-at"></i> E-Mail &amp; Benachrichtigungen</a></li>
                <li><a href="#"><i className="fa fa-image"></i> Foto</a></li>
                <li className="divider"></li>
                <li><a href="#"><i className="fa fa-list"></i> Benutzerdaten</a></li>
                <li className="divider"></li>
                <li><a href="#"><i className="fa fa-sign-in-alt"></i> Automatische Anmeldungen</a></li>
              </ul>
            </li>
            <li className={`dropdown ${openDropdown === "support" ? "open" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "support" ? null : "support");
                }}
              >
                <i className="fa-solid fa-headset"></i> Support <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><i className="fa-solid fa-headset"></i> Support</a></li>
                <li><a href="#">Datenschutz</a></li>
                <li><a href="#">Hilfe/FAQ</a></li>
                <li className="divider"></li>
                <li><a href="#">Impressum</a></li>
              </ul>
            </li>
            <li>
              <a href="#"><i className="fa fa-power-off"></i> Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="container">
        <div id="content">
          <h1>
            <span className="desktop-only">Mein Vertretungsplan</span>
            <span className="mobile-only">Mein Vplan</span>
          </h1>

          {/* Day selector */}
          <div className="panel panel-info">
            <div className="panel-body">
              {days.map((day, i) => {
                const label = getDayLabel(day);
                const count = (data[`day${i}`] || []).length;
                return (
                  <button
                    key={i}
                    className={`btn day-btn ${i === activeDay ? "btn-primary" : "btn-info"}`}
                    onClick={() => {
                      setActiveDay(i);
                      setSearchTerm("");
                    }}
                  >
                    {WEEKDAYS[day.getDay()]},{" "}
                    <span className="desktop-only">den </span>
                    <span className="mobile-only">{formatDateShort(day)}</span>
                    <span className="desktop-only">{formatDate(day)}</span>
                    {" "}
                    <span className="badge badge-warning">{count}</span>
                    {label && (
                      <>
                        {" "}
                        <span className={`label ${label === "heute" ? "label-info" : "label-default"}`}>
                          {label}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active day panel */}
          <div className="panel panel-primary">
            <div className="panel-heading">
              {WEEKDAYS[days[activeDay].getDay()]}
              <span className="desktop-only">, den {formatDate(days[activeDay])}</span>
              {getDayLabel(days[activeDay]) && (
                <> <span className="badge">{getDayLabel(days[activeDay])}</span></>
              )}
              {" "}
              <span className="badge woche">WA-Woche</span>
            </div>
            <div className="panel-body">
              <h3 style={{ fontSize: "20px", fontWeight: 300, marginBottom: 15 }}>
                Vertretungen am {formatDate(days[activeDay])}
              </h3>

              <div className="table-toolbar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Suchen"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="vplan-table">
                  <thead>
                    <tr>
                      <th>Stunde</th>
                      <th>Klasse</th>
                      <th>Vertretung</th>
                      <th>Lehrkraft</th>
                      <th>Art</th>
                      <th className="desktop-only">Fach</th>
                      <th>Fach_alt</th>
                      <th className="desktop-only">Raum</th>
                      <th>Raum_alt</th>
                      <th>Hinweis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{entry.stunde}</td>
                        <td>{entry.klasse}</td>
                        <td>{entry.vertreter || ""}</td>
                        <td>{entry.lehrkraft ? <del>{entry.lehrkraft}</del> : ""}</td>
                        <td>{entry.art}</td>
                        <td className="desktop-only">{entry.fach || ""}</td>
                        <td>{entry.fach_alt || ""}</td>
                        <td className="desktop-only">{entry.raum || ""}</td>
                        <td>{entry.raum_alt || ""}</td>
                        <td>{entry.hinweis || ""}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: 20, color: "#999" }}>
                          Keine Einträge gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-info">
                Zeige 1 bis {filtered.length} von {filtered.length} Zeilen
              </div>

              <div className="update-time">
                Letzte Aktualisierung: {getNow()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-brand desktop-only">Schulportal<sup>HESSEN</sup></span>
            <div className="footer-links">
              <a href="#">Datenschutz</a>
              <span style={{ margin: "0 5px" }}>|</span>
              <a href="#">Impressum</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
