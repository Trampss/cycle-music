import { p } from '@cycle/dom'
import xs from 'xstream'

export default ({ NOTE$, props$ }) => {
  const className = '.character'

  const vdom$ = props$
    .map(props => p(className, props.name))

  const music$ = xs.combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([{ frequency }]) => ({ frequency: frequency + 1000 }))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
