import React from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

function EconomyStat({ label, value, tone = "purple" }) {
  return (
    <div
      className={`crm-hover-lift rounded-2xl border border-white/10 bg-black/20 p-4 ${
        tone === "green" ? "crm-glow-green" : "crm-glow-purple"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-black ${
          tone === "green" ? "text-emerald-300" : "text-violet-200"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function GameEconomyWidget() {
  const { currentAgent, wealthRankings, skillRankings } = useGameEconomy();

  if (!currentAgent) return null;

  const wealthRank =
    wealthRankings.find((agent) => agent.id === currentAgent.id)?.wealthRank || "-";

  const skillRank =
    skillRankings.find((agent) => agent.id === currentAgent.id)?.skillRank || "-";

  const winRate = currentAgent.gamesPlayed
    ? Math.round((currentAgent.wins / currentAgent.gamesPlayed) * 100)
    : 0;

  return (
    <div className="crm-panel crm-hover-lift crm-glow-purple relative rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 text-white backdrop-blur-xl">
      <div className="crm-orb-purple right-[-60px] top-[-70px]" />
      <div className="crm-orb-green bottom-[-50px] left-[-40px]" />

      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Agent Economy
          </div>
          <div className="mt-1 text-xl font-black">{currentAgent.name}</div>
        </div>

        <div className="crm-shimmer rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
          Live
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3">
        <EconomyStat label="Dog Bones" value={currentAgent.dogBones} tone="green" />
        <EconomyStat label="Score" value={currentAgent.leaderboardScore} tone="purple" />
        <EconomyStat label="Wealth Rank" value={`#${wealthRank}`} tone="green" />
        <EconomyStat label="Skill Rank" value={`#${skillRank}`} tone="purple" />
        <EconomyStat label="Wins / Losses" value={`${currentAgent.wins} / ${currentAgent.losses}`} tone="green" />
        <EconomyStat label="Win Rate" value={`${winRate}%`} tone="purple" />
      </div>
    </div>
  );
}