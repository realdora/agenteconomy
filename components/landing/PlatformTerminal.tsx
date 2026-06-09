"use client";

// Reusable terminal pieces for PlatformSection: the chrome, the live pulse, and the
// real-data.json document that reveals line by line. All values are the REAL
// agenteconomy.to/data.json (raw integers = valid JSON) — no fabricated stream.

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { Snapshot } from "@/lib/platform-data";

// ── per-protocol accent colors (match the rest of the site) ──
export const PROTO_COLOR: Record<string, string> = {
  x402: "#00FF88",
  erc8004: "#7ad7ff",
  baseAgentic: "#ffb86c",
  virtualsAcp: "#9E7BFF",
  tempoMpp: "#ff7ab6",
  olas: "#c0c4cc",
};
export const protoColor = (p: string) => PROTO_COLOR[p] ?? "#c0c4cc";

export function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── replay the reveal each time the terminal scrolls back into view ──
export function useInViewReplay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [playKey, setPlayKey] = useState(0);
  const inRef = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !inRef.current) {
          inRef.current = true;
          setPlayKey((k) => k + 1);
        } else if (!e.isIntersecting && inRef.current) {
          inRef.current = false;
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, playKey };
}

// ── terminal chrome (3 dots + label + right slot) ──
export function TerminalFrame({
  label,
  stream,
  right,
  children,
}: {
  label: string;
  stream?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0a0a0e] overflow-hidden">
      <style>{`
        @keyframes pv-line { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes pv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pv-cursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      `}</style>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ae-term-label ml-3 font-mono uppercase text-white/40">
          {label}
          {stream ? <span className="ae-term-stream"> {stream}</span> : null}
        </span>
        {right ? <span className="ae-term-block ml-auto flex items-center gap-2 font-mono text-white/40 whitespace-nowrap">{right}</span> : null}
      </div>
      {children}
    </div>
  );
}

export const LivePulse = ({ children }: { children: ReactNode }) => (
  <>
    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
    {children}
  </>
);

// ── JSON token colors ──
const KeyTok = ({ children }: { children: ReactNode }) => <span style={{ color: "#00FF88" }}>{children}</span>;
const StrTok = ({ children }: { children: ReactNode }) => <span style={{ color: "#ffb86c" }}>{children}</span>;
const NumTok = ({ children }: { children: ReactNode }) => <span style={{ color: "#7ad7ff" }}>{children}</span>;
const Pun = ({ children }: { children: ReactNode }) => <span className="text-white/35">{children}</span>;

function Row({ i, indent = 0, children }: { i: number; indent?: number; children: ReactNode }) {
  return (
    <div className="whitespace-pre" style={{ paddingLeft: indent * 18, animation: `pv-line 0.4s ease-out ${0.1 + i * 0.08}s both` }}>
      {children}
    </div>
  );
}

function ObjRow({ name, fields, i, comma = true }: { name: string; fields: Array<[string, number]>; i: number; comma?: boolean }) {
  return (
    <Row i={i} indent={1}>
      <KeyTok>{`"${name}"`}</KeyTok>
      <Pun>{": { "}</Pun>
      {fields.map(([k, v], j) => (
        <span key={k}>
          {j > 0 ? <Pun>, </Pun> : null}
          <KeyTok>{`"${k}"`}</KeyTok>
          <Pun>: </Pun>
          <NumTok>{v}</NumTok>
        </span>
      ))}
      <Pun>{` }${comma ? "," : ""}`}</Pun>
    </Row>
  );
}

// The real data.json document, revealed line by line (raw integers = valid JSON).
// Re-mount via a changing `key` to replay the reveal.
export function JsonDoc({ snapshot, compact = false }: { snapshot: Snapshot; compact?: boolean }) {
  const s = snapshot;
  const ts = (s.updatedAt || "").slice(0, 19) + "Z";
  let i = 0;
  const next = () => i++;
  return (
    <pre className={`ae-term-pre font-mono leading-[1.75] text-white/85 px-4 ${compact ? "py-4" : "py-5"} md:px-6 ${compact ? "md:py-5" : "md:py-6"} overflow-x-auto`}>
      <Row i={next()}>
        <Pun>{"{"}</Pun>
      </Row>
      <Row i={next()} indent={1}>
        <KeyTok>{`"updatedAt"`}</KeyTok>
        <Pun>: </Pun>
        <StrTok>{`"${ts}"`}</StrTok>
        <Pun>,</Pun>
      </Row>
      <ObjRow i={next()} name="x402" fields={[["totalTxs", s.x402.totalTxs], ["totalVolume", s.x402.totalVolume], ["facilitators", s.x402.facilitators], ["chains", s.x402.chains]]} />
      <ObjRow i={next()} name="olas" fields={[["totalTxs", s.olas.totalTxs]]} />
      <ObjRow i={next()} name="virtualsAcp" fields={[["totalMemos", s.virtualsAcp.totalMemos]]} />
      <ObjRow i={next()} name="erc8004Registry" fields={[["totalAgents", s.erc8004Registry.totalAgents], ["chains", s.erc8004Registry.chains]]} />
      <ObjRow i={next()} name="tempoMpp" fields={[["totalEvents", s.tempoMpp.totalEvents], ["uniquePayers", s.tempoMpp.uniquePayers], ["uniquePayees", s.tempoMpp.uniquePayees]]} />
      <ObjRow i={next()} name="baseAgentic" fields={[["totalTxs", s.baseAgentic.totalTxs]]} />
      <Row i={next()} indent={1}>
        <KeyTok>{`"sources"`}</KeyTok>
        <Pun>: [</Pun>
      </Row>
      {s.sources.map((src, k) => (
        <Row key={src} i={next()} indent={2}>
          <StrTok>{`"${src}"`}</StrTok>
          <Pun>{k < s.sources.length - 1 ? "," : ""}</Pun>
        </Row>
      ))}
      <Row i={next()} indent={1}>
        <Pun>]</Pun>
      </Row>
      <Row i={next()}>
        <Pun>{"}"}</Pun>
        <span className="inline-block w-2 h-[1.05em] -mb-[0.15em] ml-1 bg-[#00FF88]/80" style={{ animation: "pv-cursor 1.1s step-end infinite" }} />
      </Row>
    </pre>
  );
}
