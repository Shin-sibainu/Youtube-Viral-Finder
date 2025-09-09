export default function Loading() {
  return (
    <div className="card">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr 100px 110px 80px 130px 80px", gap: 12, alignItems: "center", padding: "8px 0" }}>
          <div className="skeleton" style={{ width: 120, height: 68 }} />
          <div className="skeleton" style={{ width: "80%" }} />
          <div className="skeleton" style={{ width: "60%" }} />
          <div className="skeleton" style={{ width: 80 }} />
          <div className="skeleton" style={{ width: 90 }} />
          <div className="skeleton" style={{ width: 60 }} />
          <div className="skeleton" style={{ width: 100 }} />
          <div className="skeleton" style={{ width: 60 }} />
        </div>
      ))}
    </div>
  );
}

