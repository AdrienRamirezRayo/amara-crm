import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, AlertTriangle, Search } from "lucide-react";

function getPriorityClass(priority) {
  const value = priority.toLowerCase();

  if (value === "high") return "priority-high";
  if (value === "medium") return "priority-medium";
  if (value === "low") return "priority-low";
  return "priority-default";
}

function getStatusClass(status) {
  return status.toLowerCase() === "completed" ? "status-completed" : "status-open";
}

export default function TasksPage({ tasks, currentUser }) {
  const [taskList, setTaskList] = useState(tasks);
  const [query, setQuery] = useState("");

  function toggleTask(id) {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Completed" ? "Open" : "Completed",
            }
          : task
      )
    );
  }

  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const text = `${task.title} ${task.lead} ${task.agent} ${task.due} ${task.priority} ${task.status}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [taskList, query]);

  const openCount = taskList.filter((task) => task.status === "Open").length;
  const completedCount = taskList.filter((task) => task.status === "Completed").length;
  const overdueCount = taskList.filter((task) => task.due === "Overdue").length;
  const highPriorityCount = taskList.filter((task) => task.priority === "High").length;

  return (
    <div>
      <div className="search-bar glass-card">
        <Search size={18} color="#8dffe5" />
        <input
          type="text"
          placeholder="Search task center..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Open Tasks</div>
                <div className="stat-value">{openCount}</div>
              </div>
              <div className="stat-icon">
                <Clock3 size={22} />
              </div>
            </div>
            <div className="stat-change">
              {currentUser?.role} task workload
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completedCount}</div>
              </div>
              <div className="stat-icon">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <div className="stat-change">Finished tasks tracked</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Overdue</div>
                <div className="stat-value">{overdueCount}</div>
              </div>
              <div className="stat-icon">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className="stat-change">Needs attention now</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">High Priority</div>
                <div className="stat-value">{highPriorityCount}</div>
              </div>
              <div className="stat-icon">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className="stat-change">Focus list for this role</div>
          </div>
        </div>
      </div>

      <div className="leaderboard-list">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.05 }}
          >
            <div className="card-pad">
              <div className="task-row">
                <div>
                  <div className="carrier-name">{task.title}</div>
                  <div className="carrier-meta">
                    Lead: {task.lead} • Agent: {task.agent}
                  </div>
                </div>

                <div className="task-badges">
                  <span className={`tag ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`tag ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="tag">{task.due}</span>
                </div>
              </div>

              <div className="carrier-card-actions" style={{ marginTop: 16 }}>
                <button className="small-btn" onClick={() => toggleTask(task.id)}>
                  {task.status === "Completed" ? "Mark Open" : "Mark Complete"}
                </button>
                <button className="small-btn">Open Lead</button>
                <button className="small-btn">Add Note</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}