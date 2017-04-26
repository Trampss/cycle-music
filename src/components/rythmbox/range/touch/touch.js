import { button } from '@cycle/dom'
import xs from 'xstream'

const className = '.touch'

export default ({ DOM$, props$ }) => {
  const click$ = DOM$
    .select(className)
    .events('click')

  const note$ = xs
    .combine(props$, click$)
    .map(([props]) => ({
      frequency: props.frequency,
      instrument: props.instrument,
    }))

  const vdom$ = props$
    .map(props => button(className, `${props.instrument}`))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
