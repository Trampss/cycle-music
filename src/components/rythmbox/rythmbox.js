import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import { NOTES } from '../../config'
import Range from './range'

export default ({ DOM$, props$ }) => {
  // Create characters component with props
  const createRanges = props =>
    props.map(c => isolate(Range, c.name)({
      DOM$,
      props$: xs.of({ character: c.name, notes: NOTES }),
    }))

  const ranges$ = props$.map(createRanges)

  const vdom$ = ranges$
    .map(ranges => ranges.map(r => r.DOM$))
    .map(r => xs.combine(...r)
      .map(rs => div('.rythmbox', [
        div('.title', NOTES.map(n => div('.frequency', n))),
        div(rs),
      ])))
    .flatten()

  const note$ = ranges$
    .map(ranges => xs.merge(
      ...ranges.map(r => r.NOTE$)),
    )
    .flatten()

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
