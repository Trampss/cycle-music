import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Touch from './touch'

export default ({ DOM$, props$ }) => {
  const touches$ = props$
    .map(({ character, notes }) => notes
      .map(note => ({ note, character }))
      .map(touchProps =>
        isolate(
          Touch,
          `${touchProps.character}-${touchProps.note}`,
        )({ DOM$, props$: xs.of(touchProps) }),
      ),
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
        div('.instrument', props.character),
        div('.touches', dom),
      ],
    ))

  const note$ = touches$
    .map(touches => xs.merge(...touches.map(t => t.NOTE$)))
    .flatten()

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
