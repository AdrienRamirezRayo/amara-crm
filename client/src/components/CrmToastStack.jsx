import React, { useEffect, useMemo, useState } from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

export default function CrmToastStack() {
  const { transactions, agents } = useGameEconomy();
  const [visible, setVisible] = useState([]);

  const latest = useMemo(() => transactions.slice(0, 3), [transactions]);

  useEffect(() => {
    const mapped = latest.map((tx) => {
      const name = agents.find((a) => a.id === tx.agentId)?.name || "Agent";
      return {
        id: tx.id,
        title: name,
        body: tx.note || tx.type,
        positive: tx.dogBonesChange >= 0,
      };
    });

    setVisible(mapped);
  }, [latest, agents]);

  if (!visible.length) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-[340px] flex-col gap-3">
      {visible.map((toast, index) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 ${
            toast.positive
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-violet-500/20 bg-violet-500/10"
          }`}
          style={{
            transform: `translateY(${index * 0}px)`,
            opacity: 1 - index * 0.08,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-black text-white">{toast.title}</div>
              <div className="mt-1 text-xs text-zinc-300">{toast.body}</div>
            </div>

            <div
              className={`crm-pulse-dot h-2.5 w-2.5 rounded-full ${
                toast.positive ? "bg-emerald-400" : "bg-violet-400"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}