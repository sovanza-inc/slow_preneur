import { useSnackbar } from '@saas-ui/react'

import { ContactDTO } from '@acme/api/types'
import { AddTag, TagColor, TagsList, TagsListItem } from '@acme/ui/tags-list'

import { useTags } from '#features/common/hooks/use-tags'
import { api } from '#lib/trpc/react'

export const ContactTags: React.FC<{ contact: ContactDTO }> = ({ contact }) => {
  const snackbar = useSnackbar()

  const tags = contact.tags || []

  const allTags = useTags()

  const utils = api.useUtils()

  const { mutate } = api.contacts.updateTags.useMutation({
    onError: (error) => {
      snackbar.error({
        title: 'Failed to update tags',
        description: error.message,
      })
    },
    onSettled: () => {
      utils.workspaces.invalidate()
      utils.contacts.byId.invalidate({
        id: contact.id,
        workspaceId: contact.workspaceId,
      })
      utils.contacts.activitiesById.invalidate()
    },
  })

  const onChangeTags = (tags: string[]) => {
    mutate({
      workspaceId: contact.workspaceId,
      contactId: contact.id,
      tags,
    })
  }

  return (
    <TagsList>
      {tags.map((t) => {
        const tag = allTags?.find((tag) => tag.id === t)

        return tag ? (
          <TagsListItem
            key={tag.id}
            icon={<TagColor color={tag?.color ?? undefined} />}
          >
            {tag?.name || t}
          </TagsListItem>
        ) : null
      })}
      <AddTag
        tags={allTags}
        value={tags}
        onChange={onChangeTags}
        variant={tags?.length ? 'compact' : 'default'}
      />
    </TagsList>
  )
}
