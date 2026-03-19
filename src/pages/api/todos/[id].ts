import { NextApiRequest, NextApiResponse } from 'next'
import { initializeDatabase } from '../../../lib/database'
import { Todo } from '../../../lib/entity/Todo'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dataSource = await initializeDatabase()
    const todoRepository = dataSource.getRepository(Todo)
    const id = parseInt(req.query.id as string)

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const todo = await todoRepository.findOneBy({ id })
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(todo)
    }

    if (req.method === 'PUT') {
      const { title, description, completed } = req.body
      const updates: Partial<Todo> = {}
      if (typeof title === 'string' && title.trim()) updates.title = title.trim()
      if (typeof description === 'string') updates.description = description.trim() || null
      if (typeof completed === 'boolean') updates.completed = completed
      await todoRepository.update(id, updates)
      const updatedTodo = await todoRepository.findOneBy({ id })
      return res.status(200).json(updatedTodo)
    }

    if (req.method === 'DELETE') {
      await todoRepository.delete(id)
      return res.status(204).end()
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler