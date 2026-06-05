"use client";

import Logo from "./Logo";

interface Props {
  username: string;
  onGoToDashboard: () => void;
}

export default function ProfileCreatedScreen({ username, onGoToDashboard }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--ivory)" }}>
      <div className="w-full max-w-lg">
        <div style={{ background: "#fff", borderRadius: "24px", padding: "3rem 2.5rem", boxShadow: "0 8px 60px rgba(26,58,42,0.12)", border: "1px solid var(--gray-light)", textAlign: "center" }}>

          <div className="flex justify-center mb-6">
            <Logo size="sm" />
          </div>

          {/* Success icon */}
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-mid), var(--green-light))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.8rem", boxShadow: "0 4px 20px rgba(45,90,61,0.3)" }}>
            ✓
          </div>

          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 500, color: "var(--green-dark)", marginBottom: "0.6rem", lineHeight: 1.3 }}>
            Tu perfil financiero ha sido<br />creado correctamente.
          </h2>

          <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            A partir de ahora podrás acceder a tu área personal<br />con las siguientes credenciales:
          </p>

          {/* Credentials box */}
          <div style={{ background: "var(--ivory)", borderRadius: "14px", padding: "1.5rem", border: "1px solid var(--gray-light)", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gray-mid)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tu usuario</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--green-dark)", fontFamily: "monospace", letterSpacing: "0.05em" }}>{username}</span>
            </div>
            <div style={{ height: "1px", background: "var(--gray-light)", margin: "0 0 1rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gray-mid)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contraseña</span>
              <span style={{ fontSize: "1rem", color: "var(--gray-mid)", letterSpacing: "0.1em" }}>••••••••</span>
            </div>
          </div>

          {/* Warning */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "0.9rem 1rem", marginBottom: "2rem", textAlign: "left" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: "0.82rem", color: "#92400E", lineHeight: 1.6 }}>
              Guarda tu usuario y contraseña en un lugar seguro. Los necesitarás para acceder en próximas visitas.
            </p>
          </div>

          <button
            onClick={onGoToDashboard}
            style={{ width: "100%", padding: "1rem", background: "var(--green-dark)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--green-mid)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--green-dark)"; }}
          >
            Acceder a mi área personal →
          </button>
        </div>
      </div>
    </div>
  );
}
