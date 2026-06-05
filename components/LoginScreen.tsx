"use client";

import { useState } from "react";
import Logo from "./Logo";
import { loginUser, setSession } from "@/lib/storage";

interface Props {
  onSuccess: (username: string) => void;
  onBack: () => void;
  onOnboarding: () => void;
}

export default function LoginScreen({ onSuccess, onBack, onOnboarding }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!username.trim() || !password) {
      setError("Por favor, introduce tu usuario y contraseña.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const profile = loginUser(username.trim(), password);
      setLoading(false);
      if (!profile) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      setSession(profile.username);
      onSuccess(profile.username);
    }, 600);
  };

  return (
    <div className="min-h-screen flex"
      style={{ background: "var(--ivory)" }}>

      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[420px] flex-shrink-0 px-10"
        style={{ background: "linear-gradient(160deg, #1a3a2a 0%, #2d5a3d 100%)", position: "relative", overflow: "hidden" }}>
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c8763a, transparent)" }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c8763a, transparent)" }} />
        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", color: "#fff", fontSize: "1.8rem", fontWeight: 300, lineHeight: 1.3, marginBottom: "1rem" }}>
            Asesoramiento<br />Financiero Privado
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Tu estrategia financiera personal,<br />siempre a tu alcance.
          </p>
          <div className="mt-12 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Confidencialidad garantizada
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="rounded-2xl p-8"
            style={{ background: "#fff", boxShadow: "0 4px 40px rgba(26,58,42,0.10)", border: "1px solid var(--gray-light)" }}>

            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.7rem", fontWeight: 500, color: "var(--green-dark)", marginBottom: "0.4rem" }}>
              Bienvenido de nuevo
            </h3>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Introduce tus credenciales para acceder a tu área personal.
            </p>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={labelStyle}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ej: Pablo325"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--green-mid)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,90,61,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--gray-light)"; e.currentTarget.style.boxShadow = "none"; }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  style={{ ...inputStyle, paddingRight: "3rem" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--green-mid)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,90,61,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--gray-light)"; e.currentTarget.style.boxShadow = "none"; }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1.1rem", padding: 0 }}
                  type="button"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#FFF3F0", border: "1px solid #FECACA", borderRadius: "8px", padding: "0.7rem 1rem", fontSize: "0.85rem", color: "#DC2626", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ ...primaryBtnStyle, width: "100%", marginTop: "1.5rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verificando..." : "Acceder →"}
            </button>

            <div style={{ textAlign: "center", margin: "1.5rem 0 0.8rem", position: "relative" }}>
              <div style={{ height: "1px", background: "var(--gray-light)", position: "absolute", top: "50%", left: 0, right: 0 }} />
              <span style={{ position: "relative", background: "#fff", padding: "0 1rem", color: "var(--gray-mid)", fontSize: "0.8rem" }}>
                ¿Primera vez en CT Consultores?
              </span>
            </div>

            <button
              onClick={onOnboarding}
              style={{ ...secondaryBtnStyle, width: "100%" }}
            >
              Iniciar nuevo análisis financiero
            </button>

            <button
              onClick={onBack}
              style={{ display: "block", width: "100%", textAlign: "center", marginTop: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "0.85rem" }}
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--anthracite)",
  marginBottom: "0.5rem",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem 1rem",
  border: "1.5px solid var(--gray-light)",
  borderRadius: "10px",
  fontSize: "0.95rem",
  color: "var(--anthracite)",
  background: "var(--ivory)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "0.9rem 2rem",
  background: "var(--green-dark)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "0.95rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s",
  fontFamily: "inherit",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "0.85rem 2rem",
  background: "transparent",
  color: "var(--green-dark)",
  border: "1.5px solid var(--green-dark)",
  borderRadius: "10px",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  fontFamily: "inherit",
};
