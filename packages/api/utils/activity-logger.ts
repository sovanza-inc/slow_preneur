import { createActivityLog } from '#modules/activity-logs/activity-logs.service'
import { ActivityLogTypes } from '#modules/activity-logs/activity-logs.types'

export const logActivity = async (params: {
  workspaceId: string
  actorId: string
  actorType: 'user' | 'system'
  subjectId: string
  subjectType: 'contact'
  type: ActivityLogTypes
  metadata?: Record<string, unknown>
}) => {
  return createActivityLog({
    ...params,
    metadata: params.metadata ?? {},
  })
}
