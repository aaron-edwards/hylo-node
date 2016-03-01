module.exports = {
  present: (comment, userId) => {
    var attrs = _.pick(comment.toJSON(), 'id', 'comment_text', 'created_at', 'user')
    var thanks = (comment.relations.thanks || []).map(t => t.relations.user)

    return _.extend(attrs, {
      isThanked: _.some(thanks, t => t.id === userId),
      thanks
    })
  }
}