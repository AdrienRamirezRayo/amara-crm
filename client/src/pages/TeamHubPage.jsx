import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { teamQuestions as initialTeamQuestions } from "../data/crmData";
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  Brain,
  Users,
  BadgeCheck,
} from "lucide-react";

function getRoleClass(role) {
  const value = (role || "").toLowerCase();

  if (value === "admin") return "status-open";
  if (value === "manager") return "priority-medium";
  if (value === "agent") return "priority-low";
  return "priority-default";
}

export default function TeamHubPage({ currentUser }) {
  const [questions, setQuestions] = useState(initialTeamQuestions);
  const [query, setQuery] = useState("");
  const [questionForm, setQuestionForm] = useState({
    category: "Sales",
    question: "",
  });
  const [replyDrafts, setReplyDrafts] = useState({});

  function handleQuestionChange(e) {
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
  }

  function submitQuestion(e) {
    e.preventDefault();

    const text = questionForm.question.trim();
    if (!text) return;

    const newQuestion = {
      id: Date.now(),
      category: questionForm.category,
      question: text,
      author: currentUser?.name || "Unknown",
      role: currentUser?.role || "Agent",
      time: "Just now",
      replies: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setQuestionForm({
      category: "Sales",
      question: "",
    });
  }

  function setReplyValue(questionId, value) {
    setReplyDrafts((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  function submitReply(questionId) {
    const text = (replyDrafts[questionId] || "").trim();
    if (!text) return;

    setQuestions((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? {
              ...item,
              replies: [
                ...item.replies,
                {
                  id: Date.now(),
                  author: currentUser?.name || "Unknown",
                  role: currentUser?.role || "Agent",
                  time: "Just now",
                  text,
                },
              ],
            }
          : item
      )
    );

    setReplyDrafts((prev) => ({
      ...prev,
      [questionId]: "",
    }));
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const haystack =
        `${item.category} ${item.question} ${item.author} ${item.role} ${item.replies
          .map((r) => r.text)
          .join(" ")}`.toLowerCase();

      return haystack.includes(query.toLowerCase());
    });
  }, [questions, query]);

  const totalReplies = questions.reduce((sum, item) => sum + item.replies.length, 0);

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Team Questions</div>
            <div className="stat-value">{questions.length}</div>
            <div className="stat-change">Open team knowledge threads</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Replies</div>
            <div className="stat-value">{totalReplies}</div>
            <div className="stat-change">Shared answers inside AMARA</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Live Collaboration</div>
            <div className="stat-value">Active</div>
            <div className="stat-change">Agents can ask and answer inside CRM</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Knowledge Layer</div>
            <div className="stat-value">Growing</div>
            <div className="stat-change">Threads become reusable team training</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="card-pad">
            <div className="panel-title">Ask The Team</div>
            <div className="pipeline-meta">
              Agents, managers, and admins can ask questions and help each other directly inside the CRM.
            </div>

            <form className="modal-form" onSubmit={submitQuestion}>
              <select
                name="category"
                value={questionForm.category}
                onChange={handleQuestionChange}
              >
                <option>Sales</option>
                <option>Objection Handling</option>
                <option>Recruiting</option>
                <option>Carrier</option>
                <option>Underwriting</option>
                <option>Tech / CRM</option>
              </select>

              <textarea
                name="question"
                placeholder="Ask a question for the team..."
                value={questionForm.question}
                onChange={handleQuestionChange}
                rows={5}
                className="teamhub-textarea"
              />

              <div className="modal-actions">
                <button type="submit" className="primary-btn primary-btn-purple">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Send size={15} />
                    Post Question
                  </div>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06 }}
        >
          <div className="card-pad">
            <div className="panel-title">Why This Matters</div>

            <div className="activity-list">
              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Team Collaboration</div>
                    <div className="activity-meta">
                      Newer agents can learn directly from stronger agents and leadership.
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Brain size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Knowledge Capture</div>
                    <div className="activity-meta">
                      Great answers stop getting lost in random texts and calls.
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Cleaner Support</div>
                    <div className="activity-meta">
                      Managers and admins can answer publicly once instead of repeating themselves.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="search-bar glass-card">
        <Search size={18} color="#8dffe5" />
        <input
          type="text"
          placeholder="Search team discussions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="leaderboard-list" style={{ marginTop: 18 }}>
        {filteredQuestions.map((item, index) => (
          <motion.div
            key={item.id}
            className="glass-card neon-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
          >
            <div className="card-pad">
              <div className="teamhub-question-top">
                <div>
                  <div className="carrier-name">{item.question}</div>
                  <div className="carrier-meta">
                    {item.category} • {item.author} • {item.time}
                  </div>
                </div>

                <div className="task-badges">
                  <span className="tag">{item.category}</span>
                  <span className={`tag ${getRoleClass(item.role)}`}>{item.role}</span>
                </div>
              </div>

              <div className="teamhub-replies">
                {item.replies.map((reply) => (
                  <div key={reply.id} className="teamhub-reply-card">
                    <div className="teamhub-reply-top">
                      <div className="pipeline-name" style={{ fontSize: "0.95rem" }}>
                        {reply.author}
                      </div>
                      <div className="task-badges">
                        <span className={`tag ${getRoleClass(reply.role)}`}>{reply.role}</span>
                        <span className="tag">{reply.time}</span>
                      </div>
                    </div>

                    <div className="carrier-meta" style={{ marginTop: 8 }}>
                      {reply.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-spacing">
                <div className="note-form">
                  <input
                    placeholder="Write a reply..."
                    value={replyDrafts[item.id] || ""}
                    onChange={(e) => setReplyValue(item.id, e.target.value)}
                  />
                  <button
                    className="primary-btn primary-btn-purple"
                    onClick={() => submitReply(item.id)}
                    type="button"
                  >
                    Reply
                  </button>
                </div>
              </div>

              <div className="carrier-card-actions">
                <button className="small-btn">
                  <MessageSquare size={15} />
                  Open Thread
                </button>
                <button className="small-btn">
                  <BadgeCheck size={15} />
                  Save Answer
                </button>
                <button className="small-btn">Pin</button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="glass-card neon-card">
            <div className="card-pad">
              <div className="carrier-meta">No team discussions matched your search.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}