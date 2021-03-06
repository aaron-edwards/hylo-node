import moment from 'moment-timezone'
import { includes } from 'lodash'
import { get, pick, some } from 'lodash/fp'

export const defaultTimezone = 'America/Los_Angeles'

export const defaultTimeRange = type => {
  const today = moment.tz(defaultTimezone).startOf('day').add(12, 'hours')
  switch (type) {
    case 'daily':
      return [today.clone().subtract(1, 'day'), today]
    case 'weekly':
      return [today.clone().subtract(7, 'day'), today]
  }
}

export const isValidPostType = q =>
  q.where(function () {
    this.where('post.type', 'not in', ['welcome', 'project'])
    .orWhere('post.type', null)
  })

export const relatedUserColumns = (relationName = 'user') => ({
  [relationName]: q => q.column('users.id', 'users.name', 'users.avatar_url')
})

export const shouldSendData = data =>
  some(some(x => x), pick(['conversations', 'requests', 'offers'], data))

export const getPostsAndComments = (community, startTime, endTime) =>
  Promise.props({
    posts: Post.createdInTimeRange(community.posts(), startTime, endTime)
      .query(isValidPostType)
      .fetch({withRelated: ['selectedTags', relatedUserColumns()]})
      .then(collection => collection.models),

    comments: Comment.createdInTimeRange(community.comments(), startTime, endTime)
      .query(q => {
        isValidPostType(q)
        q.join('post', 'post.id', 'comment.post_id')
        q.where('post.active', true)
        q.orderBy('id', 'asc')
      })
      .fetch({withRelated: [
        'post',
        'post.selectedTags',
        relatedUserColumns(),
        relatedUserColumns('post.user')
      ]})
      .then(get('models'))
  })

export const getRecipients = (id, type) => {
  if (!includes(['daily', 'weekly'], type)) {
    throw new Error(`invalid recipient type: ${type}`)
  }

  return User.query(q => {
    q.join('users_community', 'users_community.user_id', 'users.id')
    q.whereRaw(`users.settings->>'digest_frequency' = '${type}'`)
    q.where({
      'users_community.community_id': id,
      'users_community.active': true,
      'users.active': true
    })
  }).fetchAll().then(get('models'))
}
