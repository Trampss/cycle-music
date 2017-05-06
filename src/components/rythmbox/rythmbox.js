import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Range from './range'

const notes = [
  'C', // E
  'D', // G
  'E', // D
]
const characters = [
  'Goron',
  'Zora',
  'Mojo',
  'Link',
]

export default ({ DOM$ }) => {
  const ranges = characters
    .map(character => ({ character, notes }))
    .map(props =>
      isolate(
        Range,
        props.character,
      )({ DOM$, props$: xs.of(props) }),
    )

  const vdom$ = xs
    .combine(...ranges.map(r => r.DOM$))
    .map(doms => div(
      '.rythmbox',
      [
        div('.title', notes.map(n => div('.frequency', n))),
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
