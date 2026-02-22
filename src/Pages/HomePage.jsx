import { useEffect, useMemo, useState } from "react";
import { createTodo, isValidTitle } from "../Interfaces/todo";

export default function HomePage() {
  const STORAGE_KEY = "todo-crud.todos.v1";
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [
          createTodo("Learn React basics"),
          createTodo("Build CRUD Todo"),
        ];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [
          createTodo("Learn React basics"),
          createTodo("Build CRUD Todo"),
        ];
      }
      return parsed;
    } catch {
      return [createTodo("Learn React basics"), createTodo("Build CRUD Todo")];
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const remainingCount = useMemo(() => {
    return todos.filter((t) => !t.done).length;
  }, [todos]);

  function handleAdd() {
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Title cannot be empty.");
      return;
    }
    if (trimmed.length < 1 || trimmed.length > 25) {
      setError("Title must be between 1 and 25 characters.");
      return;
    }

    const newTodo = createTodo(trimmed);
    setTodos((prev) => [newTodo, ...prev]);
    setTitle("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Todo CRUD</h1>
        <p className="mt-1 text-slate-600">
          Remaining: <span className="font-semibold">{remainingCount}</span>
        </p>

        <div className="mt-6 flex gap-2">
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
            placeholder="Add a new todo..."
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= 25) {
                setTitle(e.target.value);
                setError("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {title.length}/25 characters
        </p>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {
                      if (editingId === t.id) return;
                      setTodos((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, done: !x.done } : x,
                        ),
                      );
                    }}
                  />
                  {editingId === t.id ? (
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const newTitle = editingTitle.trim();
                          if (!newTitle) return;

                          setTodos((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, title: newTitle } : x,
                            ),
                          );
                          setEditingId(null);
                          setEditingTitle("");
                        }
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditingTitle("");
                        }
                      }}
                    />
                  ) : (
                    <span
                      className={t.done ? "line-through text-slate-400" : ""}
                    >
                      {t.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === t.id ? (
                    <>
                      <button
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                        onClick={() => {
                          const newTitle = editingTitle.trim();
                          if (!newTitle) return;

                          setTodos((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, title: newTitle } : x,
                            ),
                          );
                          setEditingId(null);
                          setEditingTitle("");
                        }}
                      >
                        Save
                      </button>

                      <button
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                        onClick={() => {
                          setEditingId(null);
                          setEditingTitle("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                      onClick={() => {
                        setEditingId(t.id);
                        setEditingTitle(t.title);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                    onClick={() => {
                      if (editingId === t.id) {
                        setEditingId(null);
                        setEditingTitle("");
                      }
                      setTodos((prev) => prev.filter((x) => x.id !== t.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
