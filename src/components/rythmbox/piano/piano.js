import { ul } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Touch from './touch'

const touches = ({ DOM$, props$ }) => (
  props$
    .map(({ notes }) => notes
      .map(note => ({ note }))
      .map(touchProps =>
        isolate(
          Touch,
          touchProps.note,
        )({ DOM$, props$: xs.of(touchProps) }),
      ),
    )
)

const model = touches$ => (
  touches$
    .map(touchesComponents => xs.combine(...touchesComponents.map(t => t.DOM$)))
    .flatten()
)

const view = state$ => (
  state$
    .map(children => ul('.piano', children))
)

const note = touches$ => (
  touches$
    .map(touchesComponents => xs.merge(...touchesComponents.map(t => t.NOTE$)))
    .flatten()
)

export default (sources) => {
  const touches$ = touches(sources)

  return {
    DOM$: view(model(touches$)),
    NOTE$: note(touches$),
  }
}
