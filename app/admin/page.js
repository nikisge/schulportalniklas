"use client";
import { useState, useEffect } from "react";

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function getSchoolDays() {
  const today = new Date();
  const days = [];
  let d = new Date(today);
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

const STUNDEN_OPTIONS = ["1 - 2", "3 - 4", "5 - 6", "8 - 9", "10 - 11"];
const ART_OPTIONS = ["Entfall", "Raum-Vtr.", "Unterricht geändert", "Vertretung"];
const KLASSE_OPTIONS = ["Q1/2", "Q3/4", "E1/2", "5a", "5b", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b"];

// Echte Lehrkräfte aus dem Q2-He Stundenplan
const EXAMPLE_LEHRKRAEFTE = [
  "Bhn", "Bkr", "Bl", "Bns", "Boe", "Bra", "Bu", "Buk", "Can", "Co",
  "Dke", "Dp", "Dtr", "Ed", "Eis", "Ens", "Epp", "Ez", "Fmt", "Fri",
  "Fu", "Geb", "Ger", "Gü", "Har", "Hau", "He", "Hmn", "Hoh", "Htl",
  "Hzg", "Kgm", "Kk", "Kmn", "Kue", "Lbt", "Lin", "Mar", "Mi", "Mkn",
  "Mr", "Mü", "Mun", "Ne", "Nev", "Ng", "Ohl", "Opp", "Ran", "Roe",
  "Roh", "Scm", "Sef", "Sgl", "Sgf", "Sho", "Slt", "Sm", "Smi", "Snk",
  "So", "Spi", "Str", "Su", "SW", "Tak", "Tyl", "Wah", "Weg", "Weh",
  "Wei", "Wer", "Wes", "Wf", "Wke", "Wl", "Wof", "Zal"
];

// Echte Kurse aus dem Q2-He Stundenplan
const EXAMPLE_FAECHER = [
  "BioNW101", "BioNW112", "BioNW114", "BioNW205", "BioNW216", "BioNW311", "BioNW317",
  "ChNW101", "ChNW105", "ChNW115", "ChNW313",
  "D01", "D12", "D13", "D14", "D15", "D16", "D17", "D18",
  "DSP12", "DSp11",
  "E01", "E02", "E05", "E06", "E07", "E11", "E12", "E13", "E14",
  "Eth11", "Eth12", "Eth13", "Eth14",
  "F05", "F15",
  "G01", "G11", "G12", "G13", "G14", "G15", "G16", "G17", "Gbili10",
  "Geo-bili10", "Geo21",
  "Info20",
  "Ku01", "Ku11", "Ku12", "Ku13",
  "L05", "L11",
  "M01", "M05", "M11", "M12", "M13", "M14", "M15", "M17",
  "Mu01", "Mu11", "Mu12",
  "Philo10",
  "PhNW117", "PhNW205", "PhNW212",
  "PoWi01", "PoWi05", "PoWi06", "PoWi12", "PoWi13", "PoWi14", "PoWi15", "PoWi16", "PoWibili10",
  "Q1Ch-NW2-14", "Q1Ph-NW3-14",
  "Rev11", "Rev12", "Rev13", "Rka11", "Rka12",
  "Spa05", "Spa12",
  "Spo07", "Spo11", "Spo12", "Spo13", "Spo14", "Spo15", "Spo16", "Spo17"
];

// Echte Räume aus dem Q2-He Stundenplan
const EXAMPLE_RAEUME = [
  "Aula", "B007", "B009", "B010", "B104", "B105", "B108", "B109", "B110",
  "B204", "B207", "B208", "B209",
  "C001", "C008", "C014", "C015", "C016", "C101", "C104", "C105", "C106",
  "C114", "C116", "C119",
  "D111", "D114", "D115", "D116", "D204", "D207", "D209", "D211", "D212",
  "D213", "D214", "D303", "D304", "D305", "D306", "D307", "D308", "D309",
  "D313", "D314", "D315", "D316",
  "D402", "D404", "D405", "D407", "D408", "D410", "D412",
  "D503", "D504", "D508", "D510", "D512",
  "E007", "E021", "E110",
  "FRÖH2", "HTH1", "HTH2"
];

const EXAMPLE_HINWEISE = [
  "; Entfall",
  "; Verlegung von Schneesportwoche II",
  "; Verlegung von Entfall für Lehrer",
  "; Verlegung von Generalprobe Streichmusiker",
  "Klausur Ph",
  "; Klausur",
  "; Studientag",
  "; Konferenz",
  "; Fortbildung",
  "; Schulveranstaltung",
];

export default function AdminPage() {
  const [entries, setEntries] = useState({ day0: [], day1: [], day2: [] });
  const [selectedDay, setSelectedDay] = useState("day0");
  const [stunde, setStunde] = useState("1 - 2");
  const [klasse, setKlasse] = useState("Q1/2");
  const [lehrkraft, setLehrkraft] = useState("");
  const [art, setArt] = useState("Entfall");
  const [fach_alt, setFachAlt] = useState("");
  const [raum_alt, setRaumAlt] = useState("");
  const [hinweis, setHinweis] = useState("; Entfall");
  const [vertreter, setVertreter] = useState("");
  const [fach, setFach] = useState("");
  const [raum, setRaum] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const days = getSchoolDays();

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("schulportal_custom_entries");
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  function save(newEntries) {
    setEntries(newEntries);
    localStorage.setItem("schulportal_custom_entries", JSON.stringify(newEntries));
  }

  function addEntry(e) {
    e.preventDefault();
    const entry = {
      stunde,
      klasse,
      lehrkraft,
      art,
      fach_alt: fach_alt || "",
      raum_alt: raum_alt || "",
      hinweis: hinweis || "",
      vertreter: vertreter || "",
      fach: fach || "",
      raum: raum || "",
      id: Date.now(),
    };
    const updated = {
      ...entries,
      [selectedDay]: [...(entries[selectedDay] || []), entry],
    };
    save(updated);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    // Reset form
    setLehrkraft("");
    setFachAlt("");
    setRaumAlt("");
    setVertreter("");
    setFach("");
    setRaum("");
  }

  function removeEntry(dayKey, idx) {
    const updated = {
      ...entries,
      [dayKey]: entries[dayKey].filter((_, i) => i !== idx),
    };
    save(updated);
  }

  function clearAll() {
    if (confirm("Alle eigenen Einträge löschen?")) {
      const empty = { day0: [], day1: [], day2: [] };
      save(empty);
    }
  }

  if (!mounted) {
    return (
      <div className="admin-container">
        <p>Lade...</p>
      </div>
    );
  }

  const totalCustom = (entries.day0?.length || 0) + (entries.day1?.length || 0) + (entries.day2?.length || 0);

  return (
    <div className="admin-container">
      <h1>
        <i className="fa fa-cog" style={{ color: "#337ab7" }}></i>{" "}
        Vertretungsplan - Admin
      </h1>

      <div className="alert alert-info">
        Hier kannst du eigene Entfälle / Vertretungen hinzufügen. Sie erscheinen sofort auf der Hauptseite.
      </div>

      {showSuccess && (
        <div className="alert alert-success">
          Eintrag hinzugefügt!
        </div>
      )}

      {/* Day selector */}
      <div style={{ marginBottom: 20 }}>
        {days.map((day, i) => (
          <button
            key={i}
            className={`btn ${selectedDay === `day${i}` ? "btn-primary" : "btn-default"}`}
            onClick={() => setSelectedDay(`day${i}`)}
            style={{ marginRight: 5 }}
          >
            {WEEKDAYS[day.getDay()]} {formatDate(day)}
            {entries[`day${i}`]?.length > 0 && (
              <> <span className="badge badge-warning">+{entries[`day${i}`].length}</span></>
            )}
          </button>
        ))}
      </div>

      {/* Add entry form */}
      <div className="panel panel-primary">
        <div className="panel-heading">Neuen Eintrag hinzufügen</div>
        <div className="panel-body">
          <form onSubmit={addEntry}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label>Stunde</label>
                <select className="form-control" value={stunde} onChange={(e) => setStunde(e.target.value)}>
                  {STUNDEN_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Klasse</label>
                <select className="form-control" value={klasse} onChange={(e) => setKlasse(e.target.value)}>
                  {KLASSE_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Lehrkraft (Kürzel)</label>
                <input
                  type="text"
                  className="form-control"
                  value={lehrkraft}
                  onChange={(e) => setLehrkraft(e.target.value)}
                  placeholder="z.B. Mi, Shü, Sef..."
                  list="lehrkraft-list"
                  required
                />
                <datalist id="lehrkraft-list">
                  {EXAMPLE_LEHRKRAEFTE.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Art</label>
                <select className="form-control" value={art} onChange={(e) => setArt(e.target.value)}>
                  {ART_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fach (ursprünglich)</label>
                <input
                  type="text"
                  className="form-control"
                  value={fach_alt}
                  onChange={(e) => setFachAlt(e.target.value)}
                  placeholder="z.B. G11, PoWi13..."
                  list="fach-list"
                />
                <datalist id="fach-list">
                  {EXAMPLE_FAECHER.map((f) => (
                    <option key={f} value={f} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Raum (ursprünglich)</label>
                <input
                  type="text"
                  className="form-control"
                  value={raum_alt}
                  onChange={(e) => setRaumAlt(e.target.value)}
                  placeholder="z.B. D314, C114..."
                  list="raum-list"
                />
                <datalist id="raum-list">
                  {EXAMPLE_RAEUME.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>

              {(art === "Raum-Vtr." || art === "Vertretung" || art === "Unterricht geändert") && (
                <>
                  <div className="form-group">
                    <label>Vertretung (Kürzel)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vertreter}
                      onChange={(e) => setVertreter(e.target.value)}
                      placeholder="z.B. Gü, Ed..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Fach (neu)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fach}
                      onChange={(e) => setFach(e.target.value)}
                      placeholder="z.B. DSp11"
                    />
                  </div>
                  <div className="form-group">
                    <label>Raum (neu)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={raum}
                      onChange={(e) => setRaum(e.target.value)}
                      placeholder="z.B. C116"
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Hinweis</label>
                <select className="form-control" value={hinweis} onChange={(e) => setHinweis(e.target.value)}>
                  {EXAMPLE_HINWEISE.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                  <option value="">-- Kein Hinweis --</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success" style={{ marginTop: 10 }}>
              <i className="fa fa-plus"></i> Eintrag hinzufügen
            </button>
          </form>
        </div>
      </div>

      {/* Existing custom entries */}
      <div className="panel panel-info">
        <div className="panel-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Eigene Einträge ({totalCustom})</span>
          {totalCustom > 0 && (
            <button className="btn btn-danger btn-sm" onClick={clearAll}>
              <i className="fa fa-trash"></i> Alle löschen
            </button>
          )}
        </div>
        <div className="panel-body">
          {["day0", "day1", "day2"].map((dayKey, dayIdx) => {
            const dayEntries = entries[dayKey] || [];
            if (dayEntries.length === 0) return null;
            return (
              <div key={dayKey} style={{ marginBottom: 15 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#337ab7" }}>
                  {WEEKDAYS[days[dayIdx].getDay()]}, {formatDate(days[dayIdx])}
                </h4>
                {dayEntries.map((entry, idx) => (
                  <div key={idx} className="admin-entry">
                    <div className="admin-entry-info">
                      <strong>{entry.stunde}</strong> — {entry.klasse} — <del>{entry.lehrkraft}</del> — {entry.art}
                      {entry.fach_alt && <> — {entry.fach_alt}</>}
                      {entry.raum_alt && <> ({entry.raum_alt})</>}
                      {entry.hinweis && <> — <em>{entry.hinweis}</em></>}
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeEntry(dayKey, idx)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
          {totalCustom === 0 && (
            <p style={{ color: "#999", textAlign: "center", padding: 20 }}>
              Noch keine eigenen Einträge hinzugefügt.
            </p>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <a href="/" className="btn btn-default">
          <i className="fa fa-arrow-left"></i> Zurück zum Vertretungsplan
        </a>
      </div>
    </div>
  );
}
