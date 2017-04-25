import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Touch from './touch'

export default ({ DOM$, props$ }) => {
  const touches$ = props$
    .map(({ instrument, frequencies }) => frequencies
      .map(frequency => xs.of({ frequency, instrument }))
      .map(touchProps$ => isolate(Touch)({ DOM$, props$: touchProps$ })),
    )

  const vdom$ = xs
    .combine(
      props$,
      touches$
        .map(touches => xs.combine(...touches.map(t => t.DOM$)))
        .flatten(),
    )
    .map(([props, dom]) => div(
      '.range',
      [
        div('.instrument', props.instrument),
        div('.touches', dom),
      ],
    ))

  const music$ = touches$
    .map(touches => xs.merge(...touches.map(t => t.MUSIC$)))
    .flatten()

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
