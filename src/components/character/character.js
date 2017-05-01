import { p } from '@cycle/dom'
import xs from 'xstream'

export default ({ NOTE$, props$ }) => {
  const className = '.character'

  const component = (props, isNotify) => p(
    `${className} ${isNotify && '.notify'}`,
    // FIXME : to css file.
    isNotify ? { style: { color: 'red' } } : { style: { color: 'black' } },
    props && `${props.name} with ${props.instrument}`)

  const animate$ = NOTE$.map(n => n.duration).flatten()

  const vdom$ = xs.combine(NOTE$, props$, animate$)
    .map(([note, props, animate]) => p(
      component(props, note.instrument === props.instrument && animate < 100)),
    )
    .startWith(component())

  const music$ = xs.combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([{ frequency }]) => ({ frequency: frequency + 1000 }))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
