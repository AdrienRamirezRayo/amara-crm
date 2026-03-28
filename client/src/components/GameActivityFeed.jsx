import React from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

export default function GameActivityFeed() {
  const { transactions, agents } = useGameEconomy();

  const getAgentName = (agentId) =>
    agents.find((agent) => agent.id === agentId)?.name || "Unknown Agent";

  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 text-white shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Activity</div>
        <div className="mt-1 text-2xl font-black">Recent Dog Bones Moves</div>
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.slice(0, 8).map((tx) => (
            <div key={tx.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white">{getAgentName(tx.agentId)}</div>
                  <div className="text-xs text-zinc-500">{tx.note || tx.type}</div>
                </div>

                <div className="text-right">
                  <div className={`font-black ${tx.dogBonesChange >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {tx.dogBonesChange >= 0 ? "+" : ""}
                    {tx.dogBonesChange} Bones
                  </div>
                  <div className="text-xs text-zinc-500">
                    {tx.leaderboardChange >= 0 ? "+" : ""}
                    {tx.leaderboardChange} Score
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
            No activity yet.
          </div>
        )}
      </div>
    </div>
  );
}