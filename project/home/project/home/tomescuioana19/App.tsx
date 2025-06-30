import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  completed: boolean;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
}

const teamMembers = ["Ioana", "Alex", "Maria"];
const priorities = ["Low", "Medium", "High"];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Task tracker states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(teamMembers[0]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // Optional: clear tasks or reset other states if needed
  };

  const handleAddOrUpdateTask = () => {
    if (!title.trim()) return;
    if (editingTaskId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title, description, assignedTo, dueDate, priority }
            : task
        )
      );
      setEditingTaskId(null);
    } else {
      const newTask: Task = {
        id: Date.now(),
        title,
        description,
        assignedTo,
        completed: false,
        dueDate,
        priority,
      };
      setTasks([...tasks, newTask]);
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setAssignedTo(teamMembers[0]);
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setEditingTaskId(task.id);
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles (same as before) ...
  const containerStyle = {
    maxWidth: 700,
    margin: "2rem auto",
    padding: "1.5rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as React.CSSProperties;

  const headingStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "12px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box" as "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 70,
    resize: "vertical" as "vertical",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    border: "none",
    padding: "12px 24px",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    borderRadius: 5,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  } as React.CSSProperties;

  const taskCardStyle = (completed: boolean): React.CSSProperties => ({
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem 1.25rem",
    marginBottom: 16,
    backgroundColor: completed ? "#e6ffe6" : "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  });

  const taskTitleStyle = (completed: boolean): React.CSSProperties => ({
    margin: 0,
    fontSize: 20,
    fontWeight: "700",
    color: completed ? "#4caf50" : "#222",
    textDecoration: completed ? "line-through" : "none",
  });

  const smallText = {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div style={containerStyle}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="current-password"
        />
        <button onClick={handleLogin} style={buttonStyle}>
          Log In
        </button>
      </div>
    );
  }

  // TASK TRACKER PAGE
  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Team Task Tracker</h1>
        <button
          onClick={handleLogout}
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
            padding: "8px 16px",
            fontSize: 14,
            height: 40,
            alignSelf: "flex-start",
          }}
        >
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={inputStyle}
      />

      {filteredTasks.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic", textAlign: "center" }}>
          No tasks found.
        </p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task.id} style={taskCardStyle(task.completed)}>
            <h2 style={taskTitleStyle(task.completed)}>{task.title}</h2>
            <p style={{ margin: "0.5rem 0" }}>{task.description}</p>
            <p style={smallText}>
              <strong>Due:</strong> {task.dueDate || "—"}
            </p>
            <p style={smallText}>
              <strong>Priority:</strong> {task.priority}
            </p>
            <small style={smallText}>Assigned to: {task.assignedTo}</small>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => toggleComplete(task.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: task.completed ? "#6c757d" : "#28a745",
                  marginRight: 10,
                  fontSize: 14,
                  padding: "8px 16px",
                }}
              >
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                onClick={() => handleEdit(task)}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#ffc107",
                  color: "#212529",
                  fontSize: 14,
                  padding: "8px 16px",
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2 style={{ marginBottom: "1rem", color: "#444" }}>
        {editingTaskId !== null ? "Edit Task" : "Add New Task"}
      </h2>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={textareaStyle}
      />
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        style={inputStyle}
      >
        {teamMembers.map((member) => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={inputStyle}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task["priority"])}
        style={inputStyle}
      >
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button onClick={handleAddOrUpdateTask} style={buttonStyle}>
        {editingTaskId !== null ? "Update Task" : "Add Task"}
      </button>
    </div>
  );
}
