"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { IconWallet, IconDebt, IconTrendUp, IconPatrimonio, IconPerson, IconChart, IconFinancing, IconStar } from "./Icons";
import { getUser, clearSession } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

interface Props {
  username: string;
  onLogout: () => void;
}

function calcAge(fechaNac: string): number {
  const today = new Date();
  const birth = new Date(fechaNac);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
}

function formatMonth(ym: string): string {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

const OBJETIVOS_LABELS = [
  { id: "estudios_hijos",   label: "Estudios de mis hijos" },
  { id: "jubilacion",       label: "Jubilación / Retiro anticipado" },
  { id: "cambiar_coche",    label: "Cambiar de coche" },
  { id: "entrada_casa",     label: "Entrada para una casa" },
  { id: "fondo_emergencia", label: "Fondo de emergencia" },
  { id: "viajes",           label: "Viajes y experiencias" },
  { id: "independencia",    label: "Independencia financiera" },
  { id: "negocio",          label: "Montar un negocio" },
  { id: "ahorro_largo_plazo", label: "Ahorro a largo plazo" },
  { id: "herencia",         label: "Dejar herencia / patrimonio" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 13) return "Buenos días";
  if (h < 21) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardScreen({ username, onLogout }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const p = getUser(username);
    setProfile(p);
    const raw = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    setToday(raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase().replace(/ de /g, " de "));
  }, [username]);

  function handleLogout() {
    clearSession();
    onLogout();
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ivory)" }}>
        <div style={{ textAlign: "center", color: "var(--gray-mid)" }}>Cargando tu área personal...</div>
      </div>
    );
  }

  const inmuebles  = profile.inmuebles ?? [];
  const totalDeuda = profile.deudas.reduce((s, d) => s + d.importe, 0);
  const totalHipotecas = inmuebles.reduce((s, im) => s + (im.hipotecaPendiente ?? 0), 0);
  const totalInmuebles = inmuebles.reduce((s, im) => s + im.valor, 0);
  const totalInv   = profile.inversiones.reduce((s, i) => s + i.cantidad, 0);
  const ingresos   = profile.ingresos;
  const objetivos  = profile.objetivos;
  const ingresoTotal = (ingresos?.ingresoMensual ?? 0) + (ingresos?.otrasFuentes ?? []).reduce((s, f) => s + f.importe, 0);
  const patrimonio = profile.ahorro + totalInmuebles + totalInv - totalHipotecas - totalDeuda;
  const age = calcAge(profile.fechaNac);
  const firstName = profile.nombre.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid var(--gray-light)", padding: "0 2rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(26,58,42,0.06)" }}>
        <Logo size="xs" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--green-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--anthracite)" }}>{username}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: "0.4rem 1rem", background: "none", border: "1.5px solid var(--gray-light)", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", color: "var(--gray-mid)", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--green-dark)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--green-dark)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gray-light)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gray-mid)"; }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Welcome bar */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, color: "var(--green-dark)", marginBottom: "0.25rem" }}>
              {greeting()}, {firstName}.
            </h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem" }}>
              Aquí tienes el resumen de tu situación financiera personal.
            </p>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--gray-mid)", textTransform: "capitalize" }}>{today}</span>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <KpiCard
            icon={<IconWallet size={20} color="#2d5a3d" strokeWidth={1.5} />}
            label="Ahorro disponible"
            value={fmt(profile.ahorro)}
            color="#2d5a3d"
            bg="#EAF3EE"
          />
          <KpiCard
            icon={<IconDebt size={20} color="#92400E" strokeWidth={1.5} />}
            label="Deuda total"
            value={fmt(totalDeuda + totalHipotecas)}
            color="#92400E"
            bg="#FFFBEB"
          />
          <KpiCard
            icon={<IconTrendUp size={20} color="#1e40af" strokeWidth={1.5} />}
            label="Total invertido"
            value={fmt(totalInv)}
            color="#1e40af"
            bg="#EFF6FF"
          />
          <KpiCard
            icon={<IconPatrimonio size={20} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />}
            label="Patrimonio neto estimado"
            value={fmt(patrimonio)}
            color={patrimonio >= 0 ? "#1a3a2a" : "#991B1B"}
            bg={patrimonio >= 0 ? "#f0f7f4" : "#FFF3F0"}
            highlight
          />
        </div>

        {/* Detail grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>

          {/* Personal data */}
          <DetailCard icon={<IconPerson size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Datos personales">
            <Row label="Nombre" value={profile.nombre} />
            <Row label="Edad" value={`${age} años`} />
            <Row label="Profesión" value={profile.profesion} />
          </DetailCard>

          {/* Resumen financiero */}
          <DetailCard icon={<IconChart size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Resumen financiero">
            <Row label="Ahorro líquido" value={fmt(profile.ahorro)} />
            {totalInmuebles > 0 && <Row label="Valor inmuebles" value={fmt(totalInmuebles)} />}
            {totalHipotecas > 0 && <Row label="Hipotecas pendientes" value={fmt(totalHipotecas)} highlight="warn" />}
            {totalDeuda > 0 && <Row label="Otras deudas" value={fmt(totalDeuda)} highlight="warn" />}
            {totalInv > 0 && <Row label="Total invertido" value={fmt(totalInv)} />}
            <div style={{ height: "1px", background: "var(--gray-light)", margin: "0.75rem 0" }} />
            <Row label="Patrimonio neto" value={fmt(patrimonio)} highlight={patrimonio >= 0 ? "pos" : "neg"} strong />
          </DetailCard>

          {/* Patrimonio inmobiliario */}
          <DetailCard icon={<IconDebt size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Patrimonio inmobiliario">
            {inmuebles.length === 0 ? (
              <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", fontStyle: "italic", textAlign: "center", padding: "1rem 0" }}>Sin inmuebles registrados.</p>
            ) : (
              inmuebles.map((im, i) => (
                <div key={i} style={{ padding: "0.9rem 0", borderBottom: i < inmuebles.length - 1 ? "1px solid var(--gray-light)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--anthracite)" }}>{im.nombre}</span>
                    <span style={{ fontWeight: 700, color: "var(--green-mid)", fontSize: "0.9rem", flexShrink: 0, marginLeft: "0.5rem" }}>{fmt(im.valor)}</span>
                  </div>
                  {im.tieneHipoteca && (
                    <div style={{ background: "var(--ivory)", borderRadius: "8px", padding: "0.6rem 0.8rem", marginTop: "0.4rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--gray-mid)", marginBottom: "0.2rem" }}>
                        <span>Hipoteca pendiente</span>
                        <span style={{ color: "#92400E", fontWeight: 600 }}>{fmt(im.hipotecaPendiente ?? 0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--gray-mid)", marginBottom: "0.2rem" }}>
                        <span>Cuota mensual</span>
                        <span style={{ fontWeight: 500 }}>{fmt(im.hipotecaCuota ?? 0)}/mes</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                        {im.hipotecaTipo && (
                          <span style={{ background: "rgba(26,58,42,0.08)", color: "var(--green-dark)", fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {im.hipotecaTipo}
                          </span>
                        )}
                        {im.hipotecaInteres != null && im.hipotecaInteres > 0 && (
                          <span style={{ background: "rgba(200,118,58,0.1)", color: "var(--copper)", fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "100px" }}>
                            {im.hipotecaInteres}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {!im.tieneHipoteca && (
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-mid)" }}>Sin hipoteca · Propiedad libre de cargas</span>
                  )}
                </div>
              ))
            )}
          </DetailCard>

          {/* Financiaciones */}
          <DetailCard icon={<IconFinancing size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Otras financiaciones">
            {profile.deudas.length === 0 ? (
              <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", fontStyle: "italic", textAlign: "center", padding: "1rem 0" }}>Sin financiaciones registradas.</p>
            ) : (
              profile.deudas.map((d, i) => (
                <div key={i} style={{ padding: "0.9rem 0", borderBottom: i < profile.deudas.length - 1 ? "1px solid var(--gray-light)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--anthracite)" }}>
                      {d.tipo === "Otra financiación" ? (d.tipoCustom || "Otra") : d.tipo}
                    </span>
                    <span style={{ fontWeight: 600, color: "#92400E", fontSize: "0.9rem" }}>{fmt(d.importe)}</span>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--gray-mid)" }}>Finaliza: {formatMonth(d.fechaFin)}</span>
                </div>
              ))
            )}
          </DetailCard>

          {/* Inversiones */}
          <DetailCard icon={<IconTrendUp size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Inversiones activas">
            {profile.inversiones.length === 0 ? (
              <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", fontStyle: "italic", textAlign: "center", padding: "1rem 0" }}>Sin inversiones registradas.</p>
            ) : (
              profile.inversiones.map((inv, i) => (
                <div key={i} style={{ padding: "0.9rem 0", borderBottom: i < profile.inversiones.length - 1 ? "1px solid var(--gray-light)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--anthracite)" }}>
                      {inv.producto === "Otro producto" ? (inv.productoCustom || "Otro") : inv.producto}
                    </span>
                    <span style={{ fontWeight: 600, color: "#1e40af", fontSize: "0.9rem" }}>{fmt(inv.cantidad)}</span>
                  </div>
                </div>
              ))
            )}
          </DetailCard>

          {/* Ingresos */}
          {ingresos && (
            <DetailCard icon={<IconWallet size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Fuentes de ingresos">
              <Row
                label={ingresos.tipoEmpleado === "autonomo" ? "Ingresos mensuales (autónomo)" : "Nómina neta mensual"}
                value={fmt(ingresos.ingresoMensual)}
              />
              {ingresos.otrasFuentes.length > 0 && <>
                <div style={{ height: "1px", background: "var(--gray-light)", margin: "0.5rem 0" }} />
                {ingresos.otrasFuentes.map((f, i) => (
                  <Row
                    key={i}
                    label={f.tipo === "Otro" ? (f.tipoCustom || "Otro") : f.tipo}
                    value={fmt(f.importe) + "/mes"}
                  />
                ))}
                <div style={{ height: "1px", background: "var(--gray-light)", margin: "0.5rem 0" }} />
                <Row label="Total ingresos mensuales" value={fmt(ingresoTotal) + "/mes"} highlight="pos" strong />
              </>}
              {ingresos.otrasFuentes.length === 0 && (
                <Row label="Total ingresos mensuales" value={fmt(ingresoTotal) + "/mes"} highlight="pos" strong />
              )}
            </DetailCard>
          )}

          {/* Objetivos */}
          {objetivos && objetivos.seleccionados.length > 0 && (
            <DetailCard icon={<IconStar size={16} color="#1a3a2a" strokeWidth={1.5} />} title="Objetivos financieros">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingTop: "0.25rem" }}>
                {objetivos.seleccionados.map(id => {
                  const obj = OBJETIVOS_LABELS.find(o => o.id === id);
                  const label = id === "otro" ? (objetivos.otroTexto || "Otro") : (obj?.label ?? id);
                  return (
                    <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "var(--ivory)", border: "1px solid var(--gray-light)", borderRadius: "100px", padding: "0.35rem 0.75rem", fontSize: "0.8rem", fontWeight: 500, color: "var(--anthracite)" }}>
                      <span style={{ color: "var(--copper)", fontSize: "0.75rem" }}>✦</span>
                      {label}
                    </span>
                  );
                })}
              </div>
            </DetailCard>
          )}

        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid var(--gray-light)", background: "#fff" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--gray-mid)", letterSpacing: "0.05em" }}>
          CT Consultores · Asesoramiento Financiero Privado · Todos los datos son confidenciales
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function KpiCard({ icon, label, value, color, bg, highlight }: {
  icon: React.ReactNode; label: string; value: string; color: string; bg: string; highlight?: boolean;
}) {
  return (
    <div style={{
      background: highlight ? "var(--green-dark)" : "#fff",
      borderRadius: "16px",
      padding: "1.5rem",
      border: highlight ? "none" : "1px solid var(--gray-light)",
      boxShadow: highlight ? "0 4px 24px rgba(26,58,42,0.18)" : "0 2px 12px rgba(26,58,42,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "10px", background: highlight ? "rgba(255,255,255,0.12)" : bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          {icon}
        </div>
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: highlight ? "rgba(255,255,255,0.7)" : "var(--gray-mid)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: highlight ? "#fff" : color, fontFamily: "var(--font-cormorant)", letterSpacing: "0.02em" }}>
        {value}
      </div>
    </div>
  );
}

function DetailCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid var(--gray-light)", boxShadow: "0 2px 12px rgba(26,58,42,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem", paddingBottom: "0.8rem", borderBottom: "1px solid var(--gray-light)" }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <h3 style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--anthracite)" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, highlight, strong }: { label: string; value: string; highlight?: "pos" | "neg" | "warn"; strong?: boolean }) {
  const color = highlight === "pos" ? "var(--green-mid)" : highlight === "neg" ? "#DC2626" : highlight === "warn" ? "#D97706" : "var(--anthracite)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0" }}>
      <span style={{ fontSize: "0.875rem", color: "var(--gray-mid)" }}>{label}</span>
      <span style={{ fontSize: strong ? "1rem" : "0.9rem", fontWeight: strong ? 700 : 500, color }}>{value}</span>
    </div>
  );
}
