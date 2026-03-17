"use client";
import { useState, useEffect, useCallback } from "react";

// Default demo data for 3 days - all columns from original
const DEFAULT_DATA = {
  day0: [
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Mi", art: "Entfall", fach: "", fach_alt: "G11", raum: "", raum_alt: "D314", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Shü", art: "Entfall", fach: "", fach_alt: "G12", raum: "", raum_alt: "D306", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Sef", art: "Entfall", fach: "", fach_alt: "G15", raum: "", raum_alt: "C114", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
    { stunde: "8 - 9", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Sgl", art: "Entfall", fach: "", fach_alt: "PoWi13", raum: "", raum_alt: "D204", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
    { stunde: "8 - 9", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Weh", art: "Entfall", fach: "", fach_alt: "PoWi16", raum: "", raum_alt: "D303", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
    { stunde: "8 - 9", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Htl", art: "Entfall", fach: "", fach_alt: "PoWi15", raum: "", raum_alt: "D213", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
  ],
  day1: [
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Nev", art: "Entfall", fach: "", fach_alt: "Eth13", raum: "", raum_alt: "B209", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
    { stunde: "5 - 6", klasse: "Q1/2", klasse_alt: "", vertreter: "Gü", lehrkraft: "Gü", art: "Raum-Vtr.", fach: "DSp11", fach_alt: "", raum: "C116", raum_alt: "Aula", hinweis: "; Verlegung von Generalprobe Streichmusiker", hinweis2: "", lerngruppe: "" },
    { stunde: "5 - 6", klasse: "Q1/2", klasse_alt: "", vertreter: "Ed", lehrkraft: "Ed", art: "Raum-Vtr.", fach: "Mu11", fach_alt: "", raum: "C106", raum_alt: "C001", hinweis: "", hinweis2: "", lerngruppe: "" },
    { stunde: "8 - 9", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Sgl", art: "Entfall", fach: "", fach_alt: "M01", raum: "", raum_alt: "D314", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
    { stunde: "8 - 9", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Bhn", art: "Entfall", fach: "", fach_alt: "M15", raum: "", raum_alt: "D305", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
    { stunde: "10 - 11", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Hoh", art: "Entfall", fach: "", fach_alt: "F15", raum: "", raum_alt: "C104", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
  ],
  day2: [
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Sgl", art: "Entfall", fach: "", fach_alt: "PoWi13", raum: "", raum_alt: "D204", hinweis: "; Verlegung von Schneesportwoche II", hinweis2: "", lerngruppe: "" },
    { stunde: "1 - 2", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Mar", art: "Entfall", fach: "", fach_alt: "PoWi05", raum: "", raum_alt: "D306", hinweis: "; Entfall", hinweis2: "", lerngruppe: "" },
    { stunde: "3 - 4", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Su", art: "Entfall", fach: "", fach_alt: "BioNW205", raum: "", raum_alt: "D510", hinweis: "; Verlegung von Entfall für Lehrer", hinweis2: "", lerngruppe: "" },
    { stunde: "3 - 4", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Mü", art: "Entfall", fach: "", fach_alt: "BioNW216", raum: "", raum_alt: "D512", hinweis: "; Verlegung von Entfall für Lehrer", hinweis2: "", lerngruppe: "" },
    { stunde: "3 - 4", klasse: "Q1/2", klasse_alt: "", vertreter: "", lehrkraft: "Kue", art: "Entfall", fach: "", fach_alt: "Q1Ch-NW2-14", raum: "", raum_alt: "D504", hinweis: "; Verlegung von Entfall für Lehrer", hinweis2: "", lerngruppe: "" },
    { stunde: "3 - 4", klasse: "Q1/2", klasse_alt: "", vertreter: "Scm", lehrkraft: "Scm", art: "Unterricht geändert", fach: "PhNW205", fach_alt: "", raum: "D402", raum_alt: "", hinweis: "Klausur Ph", hinweis2: "", lerngruppe: "" },
    { stunde: "3 - 4", klasse: "Q1/2", klasse_alt: "", vertreter: "Geb", lehrkraft: "Geb", art: "Unterricht geändert", fach: "PhNW212", fach_alt: "", raum: "D404", raum_alt: "", hinweis: "Klausur Ph", hinweis2: "", lerngruppe: "" },
  ],
};

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function getSchoolDays() {
  const today = new Date();
  const days = [];
  let d = new Date(today);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  if (d.getDay() === 6) d.setDate(d.getDate() + 2);
  for (let i = 0; i < 3; i++) {
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
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

function getUpdateTime(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy} um 16:40:46 Uhr`;
}

// All table columns matching original
const TABLE_COLUMNS = [
  { key: "_farbe", label: "", width: "10px" },
  { key: "stunde", label: "Stunde" },
  { key: "klasse", label: "Klasse" },
  { key: "klasse_alt", label: "Klasse_alt" },
  { key: "vertreter", label: "Vertretung" },
  { key: "lehrkraft", label: "Lehrkraft" },
  { key: "art", label: "Art" },
  { key: "fach", label: "Fach" },
  { key: "fach_alt", label: "Fach_alt" },
  { key: "raum", label: "Raum" },
  { key: "raum_alt", label: "Raum_alt" },
  { key: "hinweis", label: "Hinweis" },
  { key: "hinweis2", label: "Hinweis2" },
  { key: "lerngruppe", label: "Lerngruppe" },
];

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [data, setData] = useState(DEFAULT_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mounted, setMounted] = useState(false);

  const days = getSchoolDays();

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
    } catch (e) {}
  }, []);

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

  const closeDropdowns = useCallback(() => setOpenDropdown(null), []);
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
        <p>Lade, bitte warten...</p>
      </div>
    );
  }

  return (
    <>
      {/* Top bar - Schulportal HESSEN */}
      <div className="navbar-first desktop-only">
        <div className="container">
          <span className="brand-text">Schulportal<sup>HESSEN</sup></span>
        </div>
      </div>

      {/* School header */}
      <div id="headlogo" className="desktop-only">
        <div className="container">
          <div className="head-inner">
            <img
              src="https://start.schulportal.hessen.de/img/schullogo/5194/fe9e70100192acab3f22d3d0c10b6880.png"
              alt="Humboldtschule"
              className="school-logo-img"
            />
            <div style={{ paddingTop: "10px" }}>
              <p className="headtitle">Humboldtschule <small>Bad Homburg</small></p>
              <div className="head-subtitle">&quot;Schulportal Hessen - Pädagogische Organisation&quot;</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="navbar-main">
        <div className="container">
          <div className="mobile-header mobile-only">
            <a className="mobile-brand" href="#">Humboldtschule</a>
            <button
              className="navbar-toggle"
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          <ul className={`nav-left ${mobileMenuOpen ? "show" : ""}`}>
            <li><a href="#"><i className="fa fa-home fa-fw"></i> Start</a></li>
            <li className={`dropdown ${openDropdown === "apps" ? "open" : ""}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenDropdown(openDropdown === "apps" ? null : "apps"); }}>
                <i className="fa fa-bars"></i> Apps <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><i className="fa fa-calendar fa-fw"></i> Kalender</a></li>
                <li><a href="#"><i className="fa fa-exchange-alt fa-fw"></i> Vertretungsplan</a></li>
                <li><a href="#"><i className="fa fa-envelope fa-fw"></i> Nachrichten</a></li>
                <li><a href="#"><i className="fa fa-book fa-fw"></i> Mein Unterricht</a></li>
                <li><a href="#"><i className="fa fa-clipboard fa-fw"></i> Klausurplan</a></li>
              </ul>
            </li>
          </ul>

          <ul className={`nav-right ${mobileMenuOpen ? "show" : ""}`}>
            <li className={`dropdown ${openDropdown === "user" ? "open" : ""}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenDropdown(openDropdown === "user" ? null : "user"); }}>
                <i className="fa-solid fa-child"></i> Hansen, Niklas  (Q2-He) <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><span className="fa fa-key fa-fw"></span> Passwort ändern</a></li>
                <li><a href="#"><span className="fa fa-at fa-fw"></span> E-Mail &amp; Benachrichtigungen</a></li>
                <li><a href="#"><span className="fa fa-image fa-fw"></span> Foto</a></li>
                <li className="divider"></li>
                <li><a href="#"><span className="fa fa-list fa-fw"></span> Benutzerdaten</a></li>
                <li className="divider"></li>
                <li><a href="#"><span className="fa fa-sign-in-alt fa-fw"></span> Automatische Anmeldungen</a></li>
              </ul>
            </li>
            <li className={`dropdown ${openDropdown === "support" ? "open" : ""}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenDropdown(openDropdown === "support" ? null : "support"); }}>
                <i className="fa-solid fa-headset"></i> Support <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#"><span className="fa-solid fa-headset"></span> Support</a></li>
                <li><a href="#"><span className="glyphicon glyphicon-eye-open"></span> Datenschutz</a></li>
                <li><a href="#">Hilfe/FAQ</a></li>
                <li className="divider"></li>
                <li><a href="#">Impressum</a></li>
              </ul>
            </li>
            <li>
              <a href="#"><i className="fa fa-power-off fa-fw"></i> Logout</a>
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
          <div className="panel panel-info" id="menue_tag">
            <div className="panel-body">
              {days.map((day, i) => {
                const label = getDayLabel(day);
                const count = (data[`day${i}`] || []).length;
                return (
                  <button
                    key={i}
                    className={`btn day-btn ${i === activeDay ? "btn-primary" : "btn-info"}`}
                    onClick={() => { setActiveDay(i); setSearchTerm(""); }}
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

              {/* Toolbar matching original: search + toggle + columns button */}
              <div className="table-toolbar">
                <div className="toolbar-search">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Suchen"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="toolbar-buttons">
                  <button className="btn btn-default btn-sm toolbar-btn" title="Umschalten">
                    <i className="fa fa-list"></i>
                  </button>
                  <button className="btn btn-default btn-sm toolbar-btn" title="Spalten">
                    <i className="fa fa-th"></i> <span className="caret"></span>
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="vplan-table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "10px" }}></th>
                      {TABLE_COLUMNS.filter(c => c.key !== "_farbe").map((col) => (
                        <th key={col.key}>
                          <div className="th-inner">
                            {col.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry, idx) => (
                      <tr key={idx} data-index={idx}>
                        <td style={{ width: "10px" }}>&nbsp;</td>
                        <td>{entry.stunde}</td>
                        <td>{entry.klasse}</td>
                        <td>{entry.klasse_alt || ""}</td>
                        <td>{entry.vertreter || ""}</td>
                        <td>{entry.lehrkraft ? <del>{entry.lehrkraft}</del> : ""}</td>
                        <td>{entry.art}</td>
                        <td>{entry.fach || ""}</td>
                        <td>{entry.fach_alt || ""}</td>
                        <td>{entry.raum || ""}</td>
                        <td>{entry.raum_alt || ""}</td>
                        <td>{entry.hinweis || ""}</td>
                        <td>{entry.hinweis2 || ""}</td>
                        <td>{entry.lerngruppe || ""}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={14} style={{ textAlign: "center", padding: 20, color: "#999" }}>
                          Keine Einträge gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="clearfix"></div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginTop: 10 }}>
                <div className="pagination-info">
                  Zeige 1 bis {filtered.length} von {filtered.length} Zeilen
                </div>
                <div className="update-time">
                  <i>Letzte Aktualisierung: {getUpdateTime(days[activeDay])}</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="footer-inner desktop-only">
            <div>
              <span className="footer-brand">Schulportal<sup>HESSEN</sup></span>
            </div>
            <div className="footer-links">
              <a href="#">Datenschutz</a>
              &nbsp;|&nbsp;
              <a href="#">Impressum</a>
            </div>
          </div>
          <div className="footer-inner-mobile mobile-only" style={{ textAlign: "center", fontSize: "8pt" }}>
            <a href="#">Datenschutz</a>
            &nbsp;|&nbsp;
            <a href="#">Impressum</a>
          </div>
        </div>
      </div>
    </>
  );
}
