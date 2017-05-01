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
      duration$: xs.periodic(1),
    }))

  const vdom$ = props$
    .map(() => button(className, '♪'))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
