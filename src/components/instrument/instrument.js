import {button} from '@cycle/dom'
import xs from 'xstream'

export default ({DOM$}) => {
  const componentClass = '.instrument'

  const props$ = xs.of({className: componentClass, value: 2000})

  // listen click event
  const clickValue$ = DOM$
    .select(componentClass)
    .events('click')
    .map(() => (Math.random()*1000)+200)

  const value$ = xs.merge(
    props$.map(props => props.value),
    clickValue$
  )

  const vdom$ = xs.combine(props$, value$)
    .map(([props, value]) => button(props.className, value))

  const music$ = clickValue$
    .map(frequency => ({frequency}))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
