import slug from 'slug'

import {
  ContactModel,
  activityLogs,
  and,
  contacts,
  createId,
  db,
  desc,
  eq,
  inArray,
  tags,
} from '@acme/db'

import {
  createActivityLog,
  deleteActivityLog,
} from '#modules/activity-logs/activity-logs.service'
import { ActivityLogTypes } from '#modules/activity-logs/activity-logs.types'
import { tagColors } from '#modules/tags/tags.schema'
import { ServiceError } from '#utils/error'
import { PaginationArgs, getPaginationArgs } from '#utils/pagination'

export interface CreateContactArgs extends Omit<Partial<ContactModel>, 'id'> {
  id?: string
  workspaceId: string
  userId: string
  email: string
}

export const createContact = async (args: CreateContactArgs) => {
  const { userId, ...values } = args

  return await db.transaction(async (tx) => {
    if (values.name && !values.firstName) {
      const [firstName, lastName] = values.name.split(' ')
      values.firstName = firstName
      values.lastName = lastName
    }

    const result = await tx
      .insert(contacts)
      .values({
        ...values,
        type: values.type ?? 'lead',
        id: args.id ?? createId(),
      })
      .returning()

    const contact = result[0]

    if (contact) {
      db.insert(activityLogs).values({
        id: createId(),
        workspaceId: args.workspaceId,
        actorId: userId,
        actorType: 'user',
        subjectId: contact.id,
        subjectType: 'contact',
        type: ActivityLogTypes.CONTACT_CREATED,
      })
    }
  })
}

export interface UpdateContactArgs extends Partial<ContactModel> {
  id: string
  userId: string
}

export const updateContact = async (args: UpdateContactArgs) => {
  const { userId, ...contact } = args

  if (userId) {
    // TODO - add transaction and activity log
  }

  return db.update(contacts).set(contact).where(eq(contacts.id, contact.id))
}

export const getContactById = async (args: {
  workspaceId: string
  id: string
}) => {
  const contact = await db.query.contacts.findFirst({
    where: and(
      eq(contacts.workspaceId, args.workspaceId),
      eq(contacts.id, args.id),
    ),
  })

  return contact
}

export interface ListArgs extends PaginationArgs {
  workspaceId: string
  type?: ContactModel['type']
}

export const findContactsByType = async (args: ListArgs) => {
  const workspace = eq(contacts.workspaceId, args.workspaceId)

  return db.query.contacts.findMany({
    orderBy: desc(contacts.id),
    where: args.type ? and(workspace, eq(contacts.type, args.type)) : workspace,
    ...getPaginationArgs(args),
  })
}

export const findContactsByIds = async (ids: Array<string>) => {
  return ids?.length
    ? db.query.contacts.findMany({
        where: inArray(contacts.id, ids),
      })
    : []
}

export const createComment = async (args: {
  workspaceId: string
  contactId: string
  userId: string
  comment: string
}) => {
  return createActivityLog({
    workspaceId: args.workspaceId,
    actorId: args.userId,
    actorType: 'user',
    subjectId: args.contactId,
    subjectType: 'contact',
    type: ActivityLogTypes.COMMENT_ADDED,
    metadata: { comment: args.comment },
  })
}

export const deleteComment = async (args: {
  workspaceId: string
  commentId: string
}) => {
  return deleteActivityLog({
    workspaceId: args.workspaceId,
    id: args.commentId,
  })
}

export const updateContactTags = async (args: {
  workspaceId: string
  userId?: string
  contactId: string
  tags: string[]
}) => {
  db.transaction(async (tx) => {
    const contact = await tx.query.contacts.findFirst({
      where: and(
        eq(contacts.workspaceId, args.workspaceId),
        eq(contacts.id, args.contactId),
      ),
      columns: {
        tags: true,
      },
    })

    if (!contact) {
      throw new ServiceError(
        'contacts.not_found',
        `Could not find contact with id ${args.contactId}`,
      )
    }

    // Make sure we have unique tags and slug the ids
    const mappedTags = Array.from(
      new Set(
        args.tags.map((tag) => {
          return {
            id: slug(tag, { lower: true }),
            name: tag,
          }
        }),
      ),
    )

    const ids = mappedTags.map((tag) => tag.id)

    if (args.tags.length) {
      const existingTags = await tx.query.tags.findMany({
        where: and(
          eq(tags.workspaceId, args.workspaceId),
          inArray(tags.id, ids),
        ),
      })

      const newTags = mappedTags.filter((tag) => {
        return !existingTags.find((t) => t.id === tag.id)
      })

      if (newTags.length) {
        await tx.insert(tags).values(
          newTags.map((tag) => ({
            workspaceId: args.workspaceId,
            color: tagColors[Math.floor(Math.random() * tagColors.length)],
            ...tag,
          })),
        )
      }
    }

    await db
      .update(contacts)
      .set({ tags: ids })
      .where(
        and(
          eq(contacts.workspaceId, args.workspaceId),
          eq(contacts.id, args.contactId),
        ),
      )

    const added = mappedTags
      .filter((tag) => {
        return !contact.tags?.includes(tag.id)
      })
      .map((tag) => tag.id)

    const removed = contact.tags?.filter((tag) => {
      return !mappedTags.find((t) => t.id === tag)
    })

    await db.insert(activityLogs).values({
      id: createId(),
      workspaceId: args.workspaceId,
      actorId: args.userId,
      actorType: args.userId ? 'user' : 'system',
      subjectId: args.contactId,
      subjectType: 'contact',
      type: ActivityLogTypes.TAGS_UPDATED,
      metadata: { added, removed },
    })
  })
}
