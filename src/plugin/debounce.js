import _ from 'lodash'

import { Bacon } from 'sigh-core'
import { bufferingDebounce } from 'sigh-core/lib/stream'

export default function(op, delay = 500) {
  // return bufferingDebounce(op.stream, delay).map(_.flatten)

  var initPhase = true
  var buffer = []
  return op.stream.flatMapLatest(events => {
    // avoid buffering during file watch phase
    if (! initPhase)
      return events

    if (events.some(event => ! event.initPhase)) {
      // glob found end of init phase
      initPhase = false
      return events
    }

    // TODO: coalesce events to reflect latest fs state
    buffer.push(events)
    return Bacon.later(delay, buffer).map(buffer => _.flatten(buffer.splice(0)))
  })

}
