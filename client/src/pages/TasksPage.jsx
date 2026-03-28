import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks";

export default function TasksPage({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const { data, error } = await fetchTasks();

    if (!error && Array.isArray(data)) {
      setTasks(data);
    }

    setLoading(false);
  }

  async function handleAddTask() {
    if (!newTask.trim()) return;

    const { data, error } = await createTask({
      title: newTask,
      owner_id: currentUser?.id,
    });

    if (!error && data) {
      setTasks((prev) => [data, ...prev]);
      setNewTask("");
    }
  }

  async function handleToggle(task) {
    const newStatus = task.status === "Done" ? "Open" : "Done";

    const { data, error } = await updateTask(task.id, {
      status: newStatus,
    });

    if (!error && data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? data : t))
      );
    }
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Tasks</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                textDecoration:
                  task.status === "Done" ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleToggle(task)}>
                {task.status === "Done" ? "Undo" : "Done"}
              </button>

              <button onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}