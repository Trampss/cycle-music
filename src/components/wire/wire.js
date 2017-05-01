import { p } from '@cycle/dom'
import xs from 'xstream'

export default ({ MUSIC$, props$ }) => {
  const className = '.wire'

  const animate$ = MUSIC$.map(n => n.duration$).flatten()

  const component = (props, isNotify) => p(
    `${className} ${isNotify && '.notify'}`,
    // FIXME : to css file.
    isNotify ? { style: { backgroundColor: 'red' } } : { style: { backgroundColor: 'white' } },
    props && `----------${props.name}----------`)

  const vdom$ = xs.combine(MUSIC$, props$, animate$)
    .map(([music, props, animate]) => component(props, music && animate < 100))
    .startWith(component())

  return {
    DOM$: vdom$,
    MUSIC$,
  }
}
