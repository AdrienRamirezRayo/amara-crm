import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { directMessageThreads as initialThreads } from "../data/crmData";
import { MessageCircle, Send, Search, UserRound } from "lucide-react";

function getRoleClass(role) {
  const value = (role || "").toLowerCase();
  if (value === "admin") return "status-open";
  if (value === "manager") return "priority-medium";
  if (value === "agent") return "priority-low";
  return "priority-default";
}

export default function DirectMessagesPage({ currentUser }) {
  const [threads, setThreads] = useState(initialThreads);
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState(initialThreads[0]?.id || null);
  const [draft, setDraft] = useState("");

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const haystack = `${thread.title} ${thread.participants.join(" ")} ${thread.messages
        .map((m) => m.text)
        .join(" ")}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [threads, search]);

  const selectedThread =
    filteredThreads.find((thread) => thread.id === selectedThreadId) ||
    threads.find((thread) => thread.id === selectedThreadId) ||
    null;

  function sendMessage() {
    const text = draft.trim();
    if (!text || !selectedThread) return;

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === selectedThread.id
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: Date.now(),
                  sender: currentUser?.name || "Unknown",
                  role: currentUser?.role || "Agent",
                  time: "Just now",
                  text,
                },
              ],
            }
          : thread
      )
    );

    setDraft("");
  }

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Direct Threads</div>
            <div className="stat-value">{threads.length}</div>
            <div className="stat-change">Private team conversations</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Your Role</div>
            <div className="stat-value" style={{ fontSize: "1.3rem" }}>
              {currentUser?.role || "Agent"}
            </div>
            <div className="stat-change">Role-aware collaboration layer</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Live Messaging</div>
            <div className="stat-value">Active</div>
            <div className="stat-change">Agent-to-team support inside AMARA</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Support Speed</div>
            <div className="stat-value">Fast</div>
            <div className="stat-change">Questions stay inside the CRM</div>
          </div>
        </div>
      </div>

      <div className="messages-layout">
        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-pad">
            <div className="panel-title">Threads</div>

            <div className="search-bar glass-card" style={{ marginTop: 14, marginBottom: 14 }}>
              <Search size={18} color="#d8b4fe" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="messages-thread-list">
              {filteredThreads.map((thread) => {
                const lastMessage = thread.messages[thread.messages.length - 1];

                return (
                  <button
                    key={thread.id}
                    type="button"
                    className={`messages-thread-card ${selectedThreadId === thread.id ? "active" : ""}`}
                    onClick={() => setSelectedThreadId(thread.id)}
                  >
                    <div className="messages-thread-top">
                      <div className="pipeline-name">{thread.title}</div>
                      <span className="tag">{thread.messages.length}</span>
                    </div>
                    <div className="carrier-meta">{thread.participants.join(" • ")}</div>
                    <div className="carrier-meta" style={{ marginTop: 8 }}>
                      {lastMessage?.text || "No messages yet"}
                    </div>
                  </button>
                );
              })}

              {filteredThreads.length === 0 && (
                <div className="messages-thread-card" style={{ cursor: "default" }}>
                  <div className="carrier-meta">No threads matched your search.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 }}
        >
          <div className="card-pad">
            {selectedThread ? (
              <>
                <div className="messages-header">
                  <div>
                    <div className="panel-title">{selectedThread.title}</div>
                    <div className="carrier-meta">{selectedThread.participants.join(" • ")}</div>
                  </div>

                  <div className="soft-badge">Private Thread</div>
                </div>

                <div className="messages-chat-list">
                  {selectedThread.messages.map((message) => {
                    const mine = message.sender === currentUser?.name;

                    return (
                      <div key={message.id} className={`message-bubble-row ${mine ? "mine" : ""}`}>
                        <div className={`message-bubble ${mine ? "mine" : ""}`}>
                          <div className="message-bubble-top">
                            <div className="pipeline-name" style={{ fontSize: "0.92rem" }}>
                              {message.sender}
                            </div>
                            <div className="task-badges">
                              <span className={`tag ${getRoleClass(message.role)}`}>{message.role}</span>
                              <span className="tag">{message.time}</span>
                            </div>
                          </div>

                          <div className="carrier-meta" style={{ marginTop: 8 }}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="messages-compose">
                  <div className="messages-compose-box">
                    <UserRound size={18} />
                    <input
                      type="text"
                      placeholder="Write a private message..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>

                  <button className="primary-btn primary-btn-purple" onClick={sendMessage}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Send size={15} />
                      Send
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="messages-empty">
                <MessageCircle size={28} />
                <div className="panel-title">No thread selected</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}