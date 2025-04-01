import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaFlag, FaFlagCheckered } from "react-icons/fa";
import "./styles/TasksPage.css";

/**
 * This component renders the main task management UI.
 * View, create, update, delete, and complete tasks
 * Sort tasks by creation date or priority
 *
 * @returns TasksPage component
 */
export default function TasksPage() {
  // State for tasks and UI controls
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", priority: "low" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  // state for Tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  // context and navigation utilities
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  // useEffect to fetch tasks, tags when the component mounts
  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  // Fetch tags from the backend
  const fetchTags = async () => {
    const res = await api.get("/tags");
    setTags(res.data);
  };

  /**
   * Sorts tasks based on either priority or creation date
   * @param {*} taskList Tasks to sort
   * @returns Sorted task list
   */
  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    //
    await api.post("/tasks", { ...newTask, tags: selectedTags });
    setNewTask({ title: "", priority: "low" });
    fetchTasks();
  };

  const handleUpdate = async (id, updates) => {
    await api.put(`/tasks/${id}`, updates);
    fetchTasks();
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };

  // tags related functions
  const handleCreateTag = async (e) => {
    e.preventDefault();
    // Prevents sending empty or whitespace tags.
    if (!newTagName.trim()) return;
    const res = await api.post("/tags", { name: newTagName });
    // Update the tags state with the new tag
    setTags((prev) => [...prev, res.data]);
    setNewTagName("");
  };

  /**
   * Returns a styled icon based on the task's priority
   * @param {*} priority Task priority ('low', 'medium', 'high')
   * @returns
   */
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <FaFlag style={{ color: "#ef4444" }} />;
      case "medium":
        return <FaFlag style={{ color: "#f59e0b" }} />;
      case "low":
      default:
        return <FaFlagCheckered style={{ color: "#10b981" }} />;
    }
  };

  // sort tasks into completed and incomplete
  const incomplete = sortTasks(tasks.filter((t) => !t.completed));
  const completed = sortTasks(tasks.filter((t) => t.completed));

  // logout animation and redirect
  const handleLogout = () => {
    if (pageRef.current) pageRef.current.classList.add("fade-out-bck");
    setTimeout(() => {
      logout();
      navigate("/");
    }, 700);
  };

  return (
    <div ref={pageRef} className="tasks-page-container">
      {/* Header with title and logout button */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Today’s Flow</h2>
        <button className="Btn" onClick={handleLogout}>
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </div>
          <div className="text">Logout</div>
        </button>
      </header>

      {/* Task creation form */}
      <form onSubmit={handleCreate} className="task-form">
        <div className="task-form-row">
          <input
            type="text"
            name="taskTitle"
            className="tag-input"
            placeholder="What do you want to accomplish?"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ width: "360px" }}
          />
        </div>

        <div className="task-form-actions mt-3 d-flex gap-2 align-items-center">
          {/* Priority selector */}
          <label
            htmlFor="priority-select"
            className="form-label fw-semibold mb-1"
          >
            Priority
          </label>
          <select
            className="form-select"
            style={{
              width: "170px",
              backgroundColor: "#daf3fa",
              color: "#969696",
            }}
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <label htmlFor="tag-select" className="form-label fw-semibold mb-1">
            Tag
          </label>
          {/* Tag selection */}
          <select
            className="form-select"
            style={{
              width: "200px",
              backgroundColor: "#e0f7fa",
              color: "#969696",
            }}
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>

          <label htmlFor="tag-select" className="form-label fw-semibold mb-1">
            Save Task
          </label>
          {/* Add task button */}
          <button class="Btn">
            <div class="sign">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-floppy"
                viewBox="0 0 16 16"
              >
                <path d="M11 2H9v3h2z" />
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
              </svg>
            </div>

            <div class="text">Add</div>
          </button>
        </div>
      </form>

      {/* Tag creation form */}
      <form
        onSubmit={handleCreateTag}
        className="d-flex mt-3 gap-2 align-items-center"
      >
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="tag-input"
          placeholder="Or name it something that resonates"
          style={{ width: "360px" }}
        />
        <label htmlFor="tag-select" className="form-label fw-semibold mb-1">
          Save Tag
        </label>
        <button type="submit" className="Btn">
          <div className="sign">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-tags"
              viewBox="0 0 16 16"
            >
              <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
              <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
            </svg>
          </div>
          <div className="text">Add</div>
        </button>
      </form>

      <br />

      {/* Sort control */}
      <div className="sort-control mb-4 d-flex align-items-center gap-2">
        <label htmlFor="sort" className="sort-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-sort-down"
            viewBox="0 0 16 16"
          >
            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
          </svg>
          <span>Sort:</span>
        </label>

        <select
          id="sort"
          className="form-select"
          style={{
            width: "180px",
            backgroundColor: "#daf3fa",
            color: "#969696",
          }}
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
        >
          <option value="createdAt">Created Time</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Incomplete tasks list (Focus List) */}
      <section className="task-section">
        <h4>Focus List</h4>
        {incomplete.length === 0 ? (
          <div className="card">
            <svg
              className="wave"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L0,320Z"
                fillOpacity="1"
              ></path>
            </svg>

            <div className="message-text-container">
              <p className="message-text">Nice! Everything's done for now</p>
            </div>
          </div>
        ) : (
          <div className="list-group">
            {incomplete.map((task) => (
              <div key={task._id} className="list-group-item">
                <div className="task-card-top">
                  <div className="cl-toggle-switch d-flex align-items-center gap-2">
                    <label className="cl-switch">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                      />
                      <span></span>
                    </label>
                    <span className="toggle-label">Complete</span>
                  </div>
                  <div className="task-controls">
                    <button
                      className="editBtn"
                      onClick={() => setEditingTask(task._id)}
                    >
                      <svg height="1em" viewBox="0 0 512 512">
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                      </svg>
                    </button>
                    <button
                      className="bin"
                      onClick={() => handleDelete(task._id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
                {/* Task content or editable form */}
                <div className="task-card-bottom">
                  <div className="flex-grow-1 d-flex flex-column align-items-center text-center">
                    {editingTask === task._id ? (
                      <div className="task-edit-form">
                        <label
                          htmlFor={`title-${task._id}`}
                          className="form-label fw-semibold"
                        >
                          Title
                        </label>
                        <input
                          value={task.title}
                          onChange={(e) =>
                            setTasks((prev) =>
                              prev.map((t) =>
                                t._id === task._id
                                  ? { ...t, title: e.target.value }
                                  : t
                              )
                            )
                          }
                        />
                        <label
                          htmlFor={`priority-${task._id}`}
                          className="form-label fw-semibold "
                        >
                          Priority
                        </label>
                        <select
                          value={task.priority}
                          onChange={(e) =>
                            setTasks((prev) =>
                              prev.map((t) =>
                                t._id === task._id
                                  ? { ...t, priority: e.target.value }
                                  : t
                              )
                            )
                          }
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>

                        <label
                          htmlFor={`tags-${task._id}`}
                          className="form-label fw-semibold "
                        >
                          Tags
                        </label>
                        <select
                          multiple
                          value={task.tags}
                          onChange={(e) => {
                            const updatedTags = Array.from(
                              e.target.selectedOptions,
                              (o) => o.value
                            );
                            setTasks((prev) =>
                              prev.map((t) =>
                                t._id === task._id
                                  ? { ...t, tags: updatedTags }
                                  : t
                              )
                            );
                          }}
                        >
                          {tags.map((tag) => (
                            <option key={tag._id} value={tag._id}>
                              {tag.name}
                            </option>
                          ))}
                        </select>

                        <div className="task-edit-buttons">
                          <button
                            className="btn-save"
                            onClick={() => handleUpdate(task._id, task)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta-row">
                          {getPriorityIcon(task.priority)}
                          <span className={`priority-label ${task.priority}`}>
                            {task.priority}
                          </span>
                          <small className="text-muted">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        {/* Show tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap justify-content-center">
                            {task.tags.map((tagEntry) => {
                              const tagId =
                                typeof tagEntry === "string"
                                  ? tagEntry
                                  : tagEntry._id;
                              const tag = tags.find((t) => t._id === tagId);
                              return tag ? (
                                <span
                                  key={tag._id}
                                  className="badge me-1"
                                  style={{
                                    color: "#969696",
                                    backgroundColor: "#deecf0",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "4px 8px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed tasks section */}
      <section className="task-section mt-4">
        <h4>
          <button
            className="view-toggle-button"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Hide" : "View"} Completed
          </button>
        </h4>
        {showCompleted && (
          <div className="list-group">
            {completed.map((task) => (
              <div
                key={task._id}
                className={`list-group-item completed ${
                  task.priority === "high"
                    ? "bg-high"
                    : task.priority === "medium"
                    ? "bg-medium"
                    : "bg-low"
                }`}
              >
                <div className="task-card-top">
                  <div className="cl-toggle-switch d-flex align-items-center gap-2">
                    <label className="cl-switch">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                      />
                      <span></span>
                    </label>
                    <span className="toggle-label">Complete</span>
                  </div>
                  <div className="task-controls">
                    <button
                      className="bin"
                      onClick={() => handleDelete(task._id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Task info */}
                <div className="task-card-bottom">
                  <div className="flex-grow-1 d-flex flex-column align-items-center text-center">
                    <s className="task-title">{task.title}</s>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      {getPriorityIcon(task.priority)}
                      <span className={`priority-label ${task.priority}`}>
                        {task.priority}
                      </span>
                      <small className="text-muted">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Show tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-2">
                      {task.tags.map((tagId) => {
                        const tag = tags.find((t) => t._id === tagId);
                        return tag ? (
                          <span
                            key={tag._id}
                            className="badge bg-info text-dark me-1"
                          >
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
