import {button} from '@cycle/dom'
import xs from 'xstream'

export default ({DOM$, props$}) => {
  // css class to identify component
  const componentClass = '.instrument'
  // Initial state of component
  const intiState$ = xs.of({className: componentClass, frequency: 2000})
  // state of component (agregate parent props and initial state)
  const state$ = xs.combine(props$, intiState$)
    .map(([props, state]) => ({
      className: state.className,
      name : props.name || 'instrument',
      frequency: props.frequency || state.frequency,
    }))

  // listen click event
  const click$ = DOM$
    .select(componentClass)
    .events('click')
    // for each click, push
    .map(() => true)

  const music$ = xs.combine(
    state$.map(props => props.frequency), // new flux, with only value property
    click$, // Synchronize value property with click event
  ).map(([frequency, click]) => ({frequency}))

  const vdom$ = state$
    .map(({className, name}) => button(className, name))



/*
  const music$ = value$.fold(
    (old, next) => ({ frequency: old.next, next }),
    { }
  ).debug()
    .map(o => o.frequency)
  .filter(f => !!f)
    .map(frequency => ({frequency}))
*/
  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
