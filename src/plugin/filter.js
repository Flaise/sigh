import _ from 'lodash'

export default function(op, ...filters) {
  filters = _.flatten(filters)

  return op.stream.flatMap(events => {
    // ensure initialisation events are forwarded
    if (events.length === 0)
      return []

    events = events.filter(event => {
      return ! filters.some(filter => {
        for (var key in filter) {
          var keyFilter = filter[key]
          var value = event[key]
          if (keyFilter instanceof RegExp) {
            if (! keyFilter.test(value))
              return true
          }
          else if (keyFilter !== value)
            return true
        }

        return false
      })
    })

    return events.length === 0 ? Bacon.never() : events
  })
}