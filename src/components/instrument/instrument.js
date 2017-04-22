import {button, makeDOMDriver} from '@cycle/dom'
//import xs from 'xstream'

export default ({DOM$}) => {
  const componentClass = '.instrument'

  // listen click event
  const clickValue$ = DOM$
    .select(componentClass)
    .events('click')
    .map(() => Math.random())
    .startWith(10)

  // change label when clicked
  const vdom$ = clickValue$
        .map(label => button(componentClass, label))

  return {
    DOM$: vdom$,
  }
}
