import React, { useState } from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

function RankPill({ rank }) {
  const styles =
    rank === 1
      ? "from-yellow-400 to-amber-300 text-black"
      : rank === 2
      ? "from-zinc-300 to-zinc-100 text-black"
      : rank === 3
      ? "from-orange-500 to-amber-400 text-black"
      : "from-violet-600 to-fuchsia-500 text-white";

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${styles} text-sm font-black shadow-[0_12px_25px_rgba(0,0,0,0.25)]`}
    >
      #{rank}
    </div>
  );
}

export default function LeaderboardPanel() {
  const { wealthRankings, skillRankings, currentAgentId } = useGameEconomy();
  const [tab, setTab] = useState("skill");

  const activeList = tab === "skill" ? skillRankings : wealthRankings;

  return (
    <div className="crm-panel crm-hover-lift crm-glow-purple relative rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 text-white backdrop-blur-xl">
      <div className="crm-orb-purple left-[-80px] top-[-80px]" />
      <div className="crm-orb-green bottom-[-60px] right-[-50px]" />

      <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Leaderboard
          </div>
          <div className="mt-1 text-2xl font-black">Competitive Rankings</div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              tab === "skill"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
            onClick={() => setTab("skill")}
          >
            Skill
          </button>

          <button
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              tab === "wealth"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
            onClick={() => setTab("wealth")}
          >
            Dog Bones
          </button>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {activeList.map((agent, index) => {
          const rank = index + 1;
          const isCurrentAgent = agent.id === currentAgentId;

          return (
            <div
              key={agent.id}
              className={`crm-hover-lift flex items-center justify-between rounded-2xl border p-4 ${
                isCurrentAgent
                  ? "border-violet-400/30 bg-violet-500/10"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <RankPill rank={rank} />

                <div>
                  <div className="font-bold text-white">{agent.name}</div>
                  <div className="text-xs text-zinc-500">
                    {agent.wins}W · {agent.losses}L · {agent.winRate || 0}% WR
                  </div>
                </div>
              </div>

              <div className="text-right">
                {tab === "skill" ? (
                  <>
                    <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                      Score
                    </div>
                    <div className="text-xl font-black text-violet-200">
                      {agent.leaderboardScore}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                      Bones
                    </div>
                    <div className="text-xl font-black text-emerald-300">
                      {agent.dogBones}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}