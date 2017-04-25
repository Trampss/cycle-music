import { button } from '@cycle/dom'
import xs from 'xstream'

const className = '.instrument'

export default ({ DOM$, props$ }) => {
  const click$ = DOM$
    .select(className)
    .events('click')

  const music$ = xs
    .combine(props$, click$)
    .map(([props]) => ({
      instrument: props.instrument,
      frequency: props.frequency,
    }))

  const vdom$ = props$
    .map(() => button(className, '@'))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
