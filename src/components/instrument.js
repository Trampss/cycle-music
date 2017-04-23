import { button } from '@cycle/dom'
import xs from 'xstream'

const defaultName = 'instrument'

export default ({
  DOM$,
  props$ = xs.of({ name: defaultName, frequency: 2000 }),
}) => {
  // css class to identify component
  const className = '.instrument'

  // listen click event
  const click$ = DOM$
    .select(className)
    .events('click')

  const music$ = xs.combine(
    props$.map(props => props.frequency), // new flux, with only value property
    click$, // Synchronize value property with click event
  ).map(([frequency]) => ({ frequency }))

  const vdom$ = props$
    .map(({ name }) => button(className, name || defaultName))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
