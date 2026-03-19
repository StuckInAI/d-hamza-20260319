import { Todo } from '../lib/entity/Todo'

type TodoListProps = {
  todos: Todo[]
  onUpdate: (id: number, updates: Partial<Todo>) => void
  onDelete: (id: number) => void
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  const handleToggleComplete = (id: number, completed: boolean) => {
    onUpdate(id, { completed: !completed })
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Todos</h2>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`bg-white shadow rounded-lg p-4 flex items-center justify-between ${todo.completed ? 'opacity-75' : ''}`}
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <div>
                <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-gray-600 mt-1">{todo.description}</p>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  Created: {new Date(todo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  const title = prompt('Enter new title:', todo.title)
                  const description = prompt('Enter new description:', todo.description || '')
                  if (title !== null) {
                    onUpdate(todo.id, { title, description: description || undefined })
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}