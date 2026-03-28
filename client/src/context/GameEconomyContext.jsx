import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const GameEconomyContext = createContext(null);

const STORAGE_KEY = "amara_game_economy_v1";

const defaultAgents = [
  {
    id: "agent-1",
    name: "Adrien",
    dogBones: 1200,
    leaderboardScore: 180,
    wins: 12,
    losses: 5,
    gamesPlayed: 17,
    lifetimeBonesEarned: 1600,
    lifetimeBonesSpent: 400,
    lastUpdated: Date.now(),
  },
  {
    id: "agent-2",
    name: "Mia",
    dogBones: 980,
    leaderboardScore: 150,
    wins: 10,
    losses: 6,
    gamesPlayed: 16,
    lifetimeBonesEarned: 1200,
    lifetimeBonesSpent: 220,
    lastUpdated: Date.now(),
  },
  {
    id: "agent-3",
    name: "Jay",
    dogBones: 860,
    leaderboardScore: 110,
    wins: 8,
    losses: 7,
    gamesPlayed: 15,
    lifetimeBonesEarned: 1000,
    lifetimeBonesSpent: 140,
    lastUpdated: Date.now(),
  },
];

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function buildRankings(agents) {
  const wealthRankings = [...agents]
    .sort((a, b) => b.dogBones - a.dogBones || b.lifetimeBonesEarned - a.lifetimeBonesEarned)
    .map((agent, index) => ({
      ...agent,
      wealthRank: index + 1,
      winRate: agent.gamesPlayed ? Math.round((agent.wins / agent.gamesPlayed) * 100) : 0,
    }));

  const skillRankings = [...agents]
    .sort((a, b) => {
      if (b.leaderboardScore !== a.leaderboardScore) {
        return b.leaderboardScore - a.leaderboardScore;
      }
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      const aWinRate = a.gamesPlayed ? a.wins / a.gamesPlayed : 0;
      const bWinRate = b.gamesPlayed ? b.wins / b.gamesPlayed : 0;

      return bWinRate - aWinRate;
    })
    .map((agent, index) => ({
      ...agent,
      skillRank: index + 1,
      winRate: agent.gamesPlayed ? Math.round((agent.wins / agent.gamesPlayed) * 100) : 0,
    }));

  return {
    wealthRankings,
    skillRankings,
  };
}

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {
        agents: defaultAgents,
        currentAgentId: "agent-1",
        transactions: [],
      };
    }

    const parsed = JSON.parse(raw);

    return {
      agents: Array.isArray(parsed.agents) && parsed.agents.length ? parsed.agents : defaultAgents,
      currentAgentId: parsed.currentAgentId || "agent-1",
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch {
    return {
      agents: defaultAgents,
      currentAgentId: "agent-1",
      transactions: [],
    };
  }
}

function createTransaction({
  agentId,
  type,
  game = null,
  dogBonesChange = 0,
  leaderboardChange = 0,
  note = "",
}) {
  return {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    agentId,
    type,
    game,
    dogBonesChange,
    leaderboardChange,
    note,
    createdAt: new Date().toISOString(),
  };
}

export function GameEconomyProvider({ children }) {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentAgent = useMemo(() => {
    return state.agents.find((agent) => agent.id === state.currentAgentId) || state.agents[0];
  }, [state.agents, state.currentAgentId]);

  const rankings = useMemo(() => buildRankings(state.agents), [state.agents]);

  const setCurrentAgentId = (agentId) => {
    setState((prev) => ({
      ...prev,
      currentAgentId: agentId,
    }));
  };

  const updateAgent = (agentId, updater) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              ...updater(agent),
              lastUpdated: Date.now(),
            }
          : agent
      ),
    }));
  };

  const addTransaction = (transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [transaction, ...prev.transactions].slice(0, 200),
    }));
  };

  const rewardWin = ({
    agentId = state.currentAgentId,
    game,
    bonesWon = 0,
    leaderboardPoints = 0,
    note = "",
  }) => {
    updateAgent(agentId, (agent) => ({
      dogBones: safeNumber(agent.dogBones) + safeNumber(bonesWon),
      leaderboardScore: safeNumber(agent.leaderboardScore) + safeNumber(leaderboardPoints),
      wins: safeNumber(agent.wins) + 1,
      losses: safeNumber(agent.losses),
      gamesPlayed: safeNumber(agent.gamesPlayed) + 1,
      lifetimeBonesEarned: safeNumber(agent.lifetimeBonesEarned) + safeNumber(bonesWon),
    }));

    addTransaction(
      createTransaction({
        agentId,
        type: "game_win",
        game,
        dogBonesChange: bonesWon,
        leaderboardChange: leaderboardPoints,
        note,
      })
    );
  };

  const recordLoss = ({
    agentId = state.currentAgentId,
    game,
    bonesLost = 0,
    leaderboardPenalty = 0,
    note = "",
  }) => {
    updateAgent(agentId, (agent) => ({
      dogBones: Math.max(0, safeNumber(agent.dogBones) - safeNumber(bonesLost)),
      leaderboardScore: Math.max(
        0,
        safeNumber(agent.leaderboardScore) - safeNumber(leaderboardPenalty)
      ),
      wins: safeNumber(agent.wins),
      losses: safeNumber(agent.losses) + 1,
      gamesPlayed: safeNumber(agent.gamesPlayed) + 1,
      lifetimeBonesSpent: safeNumber(agent.lifetimeBonesSpent) + safeNumber(bonesLost),
    }));

    addTransaction(
      createTransaction({
        agentId,
        type: "game_loss",
        game,
        dogBonesChange: -Math.abs(bonesLost),
        leaderboardChange: -Math.abs(leaderboardPenalty),
        note,
      })
    );
  };

  const spendBones = ({
    agentId = state.currentAgentId,
    amount = 0,
    type = "spend",
    note = "",
  }) => {
    const spendAmount = Math.max(0, safeNumber(amount));

    updateAgent(agentId, (agent) => ({
      dogBones: Math.max(0, safeNumber(agent.dogBones) - spendAmount),
      lifetimeBonesSpent: safeNumber(agent.lifetimeBonesSpent) + spendAmount,
    }));

    addTransaction(
      createTransaction({
        agentId,
        type,
        dogBonesChange: -spendAmount,
        leaderboardChange: 0,
        note,
      })
    );
  };

  const addBones = ({
    agentId = state.currentAgentId,
    amount = 0,
    type = "bonus",
    note = "",
  }) => {
    const addAmount = Math.max(0, safeNumber(amount));

    updateAgent(agentId, (agent) => ({
      dogBones: safeNumber(agent.dogBones) + addAmount,
      lifetimeBonesEarned: safeNumber(agent.lifetimeBonesEarned) + addAmount,
    }));

    addTransaction(
      createTransaction({
        agentId,
        type,
        dogBonesChange: addAmount,
        leaderboardChange: 0,
        note,
      })
    );
  };

  const resetEconomy = () => {
    setState({
      agents: defaultAgents,
      currentAgentId: "agent-1",
      transactions: [],
    });
  };

  const value = {
    agents: state.agents,
    currentAgent,
    currentAgentId: state.currentAgentId,
    transactions: state.transactions,
    wealthRankings: rankings.wealthRankings,
    skillRankings: rankings.skillRankings,
    setCurrentAgentId,
    rewardWin,
    recordLoss,
    spendBones,
    addBones,
    resetEconomy,
  };

  return (
    <GameEconomyContext.Provider value={value}>
      {children}
    </GameEconomyContext.Provider>
  );
}

export function useGameEconomy() {
  const context = useContext(GameEconomyContext);

  if (!context) {
    throw new Error("useGameEconomy must be used inside GameEconomyProvider");
  }

  return context;
}