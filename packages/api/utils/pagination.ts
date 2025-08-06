import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type PaginationArgs = z.infer<typeof PaginationSchema>

export const getPaginationArgs = (args: PaginationArgs) => {
  return {
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  metadata: {
    hasMore: boolean
    nextCursor?: string
    total?: number
  }
}

export const createPaginatedResponse = <T extends { id: string }>(
  items: T[],
  params: PaginationParams,
  total?: number,
): PaginatedResponse<T> => {
  const hasMore = items.length === params.limit
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined

  return {
    items,
    metadata: {
      hasMore,
      nextCursor,
      total,
    },
  }
}
