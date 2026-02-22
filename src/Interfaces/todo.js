export function isValidTitle(title) {
    if (typeof title != "string") return false;
    const t = title.trim();
    return t.length > 1 && t.length < 25;
}

export function createTodo(title) {
    const t = title.trim();
    return {
        id: crypto.randomUUID(),
        title: t,
        done: false,
        createdAt: Date.now(),
    };
}

export function updateTodoTitle(todo, newTitle) {
    return {
        ... todo,
        title: newTitle.trim(),
    };
}

export function toggleTodoDone(todo) {
    return {
        ... todo,
        done: !todo.done,
    };
}