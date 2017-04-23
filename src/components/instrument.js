import { button } from '@cycle/dom'
import xs from 'xstream'

export default ({
  DOM$,
  props$ = xs.of({ name: 'instrument', frequency: 2000 }),
}) => {
  // css class to identify component
  const clazz = '.instrument'

  // listen click event
  const click$ = DOM$
    .select(clazz)
    .events('click')
    // for each click, push
    .map(() => true)

  const music$ = xs.combine(
    props$.map(props => props.frequency), // new flux, with only value property
    click$, // Synchronize value property with click event
  ).map(([frequency]) => ({ frequency }))

  const vdom$ = props$.debug()
    .map(({ name }) => button(clazz, name || 'instrument'))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
