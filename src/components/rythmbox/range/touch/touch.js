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
      note: props.note,
      character: props.character,
      time: 4, // time in second
    }))

  const vdom$ = props$
    .map(() => button(className, '♪'))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
