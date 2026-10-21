import { useEffect, useState } from "react";
import { orgChart, columns, initialCards } from "./data.js";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "org", label: "Org chart" },
  { id: "dev", label: "App Development" },
];

function useRoute() {
  const read = () => window.location.hash.replace("#", "") || "overview";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

const [analyticsTeam, devTeam] = orgChart.children;

function Overview({ cards }) {
  const open = cards.filter((c) => c.col < 3).length;
  const inReview = cards.filter((c) => c.col === 2);
  return (
    <>
      <header className="head">
        <h1>Data team overview</h1>
        <p>{1 + analyticsTeam.children.length + devTeam.children.length + 2} people across two departments.</p>
      </header>
      <div className="split">
        <section className="panel analytics">
          <h2>{analyticsTeam.department}</h2>
          <dl className="facts">
            <div><dt>Team members</dt><dd>{analyticsTeam.children.length + 1}</dd></div>
            <div><dt>Manager</dt><dd className="small">{analyticsTeam.name}</dd></div>
          </dl>
          <a href="#org">View org chart</a>
        </section>
        <section className="panel dev">
          <h2>{devTeam.department}</h2>
          <dl className="facts">
            <div><dt>Team members</dt><dd>{devTeam.children.length + 1}</dd></div>
            <div><dt>Open tasks</dt><dd>{open}</dd></div>
          </dl>
          <a href="#dev">Open board</a>
        </section>
      </div>
      <section className="block">
        <h2>Waiting for review</h2>
        {inReview.length === 0 ? (
          <p className="muted">Nothing is waiting for review.</p>
        ) : (
          <ul className="plain">
            {inReview.map((c) => (
              <li key={c.id}><strong>{c.title}</strong><span className="muted">{c.owner}</span></li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Person({ p, selected, onSelect, tone }) {
  return (
    <button
      className={`person ${tone || ""} ${selected ? "selected" : ""}`}
      onClick={() => onSelect(p)}
      aria-pressed={selected}
    >
      <span className="pname">{p.name}</span>
      <span className="prole">{p.role}</span>
    </button>
  );
}

function OrgChart() {
  const [sel, setSel] = useState(orgChart);
  const reportsTo = (p) => {
    if (p === orgChart) return null;
    const mgr = orgChart.children.find((m) => m === p || m.children.includes(p));
    return mgr === p ? orgChart : mgr;
  };
  const boss = reportsTo(sel);
  const dept = (p) => orgChart.children.find((m) => m === p || m.children.includes(p))?.department;

  return (
    <>
      <header className="head">
        <h1>Org chart</h1>
        <p>Select a person to see their details.</p>
      </header>

      <div className="org">
        <div className="top"><Person p={orgChart} selected={sel === orgChart} onSelect={setSel} /></div>
        <div className="branches">
          {orgChart.children.map((m) => (
            <div key={m.name} className={`branch ${m.dept}`}>
              <h2 className="deptname">{m.department}</h2>
              <Person p={m} tone={m.dept} selected={sel === m} onSelect={setSel} />
              <ul className="members">
                {m.children.map((c) => (
                  <li key={c.name}><Person p={c} tone={m.dept} selected={sel === c} onSelect={setSel} /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <section className="detail" aria-live="polite">
        <h2>{sel.name}</h2>
        <dl>
          <div><dt>Role</dt><dd>{sel.role}</dd></div>
          <div><dt>Department</dt><dd>{dept(sel) || "Leads both departments"}</dd></div>
          <div><dt>Reports to</dt><dd>{boss ? boss.name : "No one (top of the chart)"}</dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${sel.email}`}>{sel.email}</a></dd></div>
        </dl>
      </section>
    </>
  );
}

function Dev({ cards, setCards }) {
  const [title, setTitle] = useState("");
  const move = (id, d) =>
    setCards(cards.map((c) => (c.id === id ? { ...c, col: Math.min(3, Math.max(0, c.col + d)) } : c)));
  const add = (e) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    setCards([...cards, { id: Date.now(), title: v, owner: "Unassigned", tag: "New", col: 0 }]);
    setTitle("");
  };
  return (
    <div className="dev">
      <header className="head">
        <h1>App Development</h1>
        <p>Work in progress across the team's apps and pipelines.</p>
      </header>
      <form onSubmit={add} className="add">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task to the backlog" aria-label="New task" />
        <button type="submit">Add task</button>
      </form>
      <div className="board">
        {columns.map((name, i) => (
          <section key={name} className="col" aria-label={name}>
            <h2>{name} <span className="muted">{cards.filter((c) => c.col === i).length}</span></h2>
            {cards.filter((c) => c.col === i).map((c) => (
              <article key={c.id} className="card">
                <p>{c.title}</p>
                <p className="muted">{c.owner} · {c.tag}</p>
                <div className="moves">
                  <button className="ghost" disabled={i === 0} onClick={() => move(c.id, -1)} aria-label={`Move back to ${columns[i - 1]}`}>Back</button>
                  <button className="ghost" disabled={i === 3} onClick={() => move(c.id, 1)} aria-label={`Move forward to ${columns[i + 1]}`}>Forward</button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [cards, setCards] = useState(initialCards);
  return (
    <div className="shell">
      <nav className="side" aria-label="Main">
        <div className="brand">Data Team Hub</div>
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={route === n.id ? "active" : ""} aria-current={route === n.id ? "page" : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <main className="main">
        {route === "org" ? <OrgChart /> : route === "dev" ? <Dev cards={cards} setCards={setCards} /> : <Overview cards={cards} />}
      </main>
    </div>
  );
}
