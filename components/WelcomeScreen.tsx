"use client";

import Logo from "./Logo";
import { IconArrowRight, IconShield, IconStar } from "./Icons";

interface Props {
  onLogin: () => void;
  onOnboarding: () => void;
}

export default function WelcomeScreen({ onLogin, onOnboarding }: Props) {
  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "row" }}>

      {/* ── LEFT PANEL — Logo sobre blanco limpio ── */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "42%", flexShrink: 0, padding: "4rem 3rem", overflow: "hidden", background: "#ffffff", borderRight: "1px solid #e8e5df" }}>

        {/* Sutil decoración de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Líneas diagonales muy finas */}
          <svg width="100%" height="100%" style={{ opacity: 0.04 }}>
            <defs>
              <pattern id="diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#1a3a2a" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
          {/* Círculo decorativo cobre tenue */}
          <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,118,58,0.07), transparent 70%)" }} />
          <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(26,58,42,0.05), transparent 70%)" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">

          {/* Logo sobre fondo blanco — perfectamente visible */}
          <div style={{ marginBottom: "2.5rem" }}>
            <Logo size="lg" />
          </div>

          {/* Separador elegante */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", width: "100%" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c8763a)" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8763a" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c8763a)" }} />
          </div>

          {/* Tagline del panel izquierdo */}
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#1a3a2a", fontWeight: 400, lineHeight: 1.7, letterSpacing: "0.02em", fontStyle: "italic" }}>
            Asesoramiento financiero privado<br />de alto nivel
          </p>

          {/* Tres pilares */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2.5rem", width: "100%" }}>
            {[
              { icon: <IconShield size={14} color="#c8763a" strokeWidth={1.5} />, text: "Confidencialidad garantizada" },
              { icon: <IconStar size={14} color="#c8763a" strokeWidth={1.5} />, text: "Análisis financiero personalizado" },
              { icon: <IconShield size={14} color="#c8763a" strokeWidth={1.5} />, text: "Estrategia con visión a largo plazo" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "6px", background: "rgba(200,118,58,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: "0.78rem", color: "#6b7280", letterSpacing: "0.02em" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Contenido y CTAs sobre verde oscuro ── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 3rem", overflow: "hidden", background: "linear-gradient(160deg, #1a3a2a 0%, #243d2e 60%, #1e3828 100%)" }}>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,118,58,0.12), transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,118,58,0.08), transparent 65%)" }} />
        </div>

        {/* Logo para pantallas muy pequeñas — oculto en desktop */}
        <div style={{ display: "none" }} />

        <div className="relative z-10 max-w-lg w-full">

          {/* Etiqueta superior */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(200,118,58,0.15)", border: "1px solid rgba(200,118,58,0.3)", borderRadius: "100px", padding: "0.35rem 1rem", marginBottom: "2rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8763a" }} />
            <span style={{ fontSize: "0.72rem", color: "#e0935a", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              CT Consultores
            </span>
          </div>

          {/* Headline principal */}
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "#ffffff", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
            Construimos tu estrategia financiera personal
            <br />
            <span style={{ color: "#e0935a", fontWeight: 500 }}>con visión, orden y elegancia.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.8, marginBottom: "3rem", maxWidth: "440px" }}>
            Bienvenido a tu espacio financiero personal. Analizamos tu situación para ayudarte a tomar mejores decisiones.
          </p>

          {/* Botones CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", maxWidth: "380px" }}>

            {/* Botón primario — Entrar */}
            <button
              onClick={onLogin}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1.1rem 1.5rem", borderRadius: "14px",
                background: "rgba(255,255,255,0.95)", color: "#1a3a2a",
                border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.95)"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.15rem" }}>
                <span style={{ fontSize: "0.68rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Ya tengo cuenta</span>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1a3a2a" }}>Entrar a mi área personal</span>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "#1a3a2a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconArrowRight size={16} color="#ffffff" strokeWidth={2} />
              </div>
            </button>

            {/* Botón secundario — Nuevo análisis */}
            <button
              onClick={onOnboarding}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1.1rem 1.5rem", borderRadius: "14px",
                background: "#c8763a", color: "#ffffff",
                border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#d98040"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(200,118,58,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c8763a"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.15rem" }}>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Primera vez</span>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff" }}>Iniciar nuevo análisis financiero</span>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconArrowRight size={16} color="#ffffff" strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Footer del panel */}
          <p style={{ marginTop: "3rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Asesoramiento financiero privado · Confidencialidad garantizada
          </p>
        </div>
      </div>
    </div>
  );
}
