import React from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

export default function AgentSwitcher() {
  const { agents, currentAgentId, setCurrentAgentId } = useGameEconomy();

  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 text-white shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-zinc-400">
        Current Agent
      </div>

      <select
        value={currentAgentId}
        onChange={(e) => setCurrentAgentId(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
      >
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
    </div>
  );
}