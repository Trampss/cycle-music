import { div, li, span } from '@cycle/dom'
import xs from 'xstream'

const className = '.touch'

export default ({ DOM$, props$ }) => {
  const click$ = DOM$
    .select(className)
    .events('click')

  const note$ = xs
    .combine(props$, click$)
    .map(([props]) => ({
      note: props.note,
      character: props.character,
      time: 4, // time in second
    }))

  const vdom$ = props$
    .map(() => li([div('.touch'), span()]))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
