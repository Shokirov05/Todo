import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../redux/apiSlice";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await addTodo({ title: newTodo, completed: false }).unwrap();
      setNewTodo("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id).unwrap();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo({ id: todo.id, completed: !todo.completed }).unwrap();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.title);
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await updateTodo({ id, title: editText }).unwrap();
      setEditingTodo(null);
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  if (isLoading) return <div className='text-center'>Loading...</div>;
  if (isError)
    return <div className='text-center text-error'>Error loading todos</div>;

  return (
    <div className='max-w-xl mx-auto p-4'>
      <h1 className='text-2xl font-bold text-center mb-8'>Todo List</h1>

      <form onSubmit={handleSubmit} className='flex gap-2 mb-8'>
        <input
          type='text'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='Add new todo'
          className='input input-bordered flex-1'
        />
        <button type='submit' className='btn btn-primary'>
          Add
        </button>
      </form>

      <ul className='space-y-4'>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className='flex items-center gap-4 bg-base-200 p-4 rounded-lg'
          >
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              className='checkbox'
            />

            {editingTodo === todo.id ? (
              <div className='flex-1 flex gap-2 items-center'>
                <input
                  type='text'
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className='input input-bordered flex-1'
                />
                <button
                  onClick={() => handleEdit(todo.id)}
                  className='btn btn-success btn-sm'
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTodo(null)}
                  className='btn btn-active btn-sm'
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-base-content/70" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => startEditing(todo)}
                  className='btn btn-active btn-sm'
                >
                  Edit
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(todo.id)}
              className='btn btn-error btn-sm'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
