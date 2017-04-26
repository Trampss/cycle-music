import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Range from './range'

const frequencies = [
  329, // E
  392, // G
  587, // D
]
const instruments = [
  'guitare',
  'bass',
  'ocarina',
  'harp',
]

export default ({ DOM$ }) => {
  const ranges = instruments
    .map(instrument => ({ instrument, frequencies }))
    .map(props =>
      isolate(
        Range,
        props.instrument,
      )({ DOM$, props$: xs.of(props) }),
    )

  const vdom$ = xs
    .combine(...ranges.map(r => r.DOM$))
    .map(doms => div(
      '.rythmbox',
      [
        div('.title', frequencies.map(f => div('.frequency', f))),
        div(doms),
      ],
    ))

  const note$ = xs
    .merge(...ranges.map(t => t.NOTE$))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
