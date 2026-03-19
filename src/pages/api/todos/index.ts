import { NextApiRequest, NextApiResponse } from 'next'
import { initializeDatabase } from '../../../lib/database'
import { Todo } from '../../../lib/entity/Todo'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dataSource = await initializeDatabase()
    const todoRepository = dataSource.getRepository(Todo)

    if (req.method === 'GET') {
      const todos = await todoRepository.find({ order: { createdAt: 'DESC' } })
      return res.status(200).json(todos)
    }

    if (req.method === 'POST') {
      const { title, description } = req.body
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' })
      }
      const todo = todoRepository.create({
        title,
        description,
        completed: false,
      })
      await todoRepository.save(todo)
      return res.status(201).json(todo)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler