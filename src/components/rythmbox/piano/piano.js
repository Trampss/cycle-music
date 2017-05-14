import { ul } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import Touch from './touch'

export default ({ DOM$, props$ }) => {
  const touches$ = props$
    .map(({ notes }) => notes
      .map(note => ({ note }))
      .map(touchProps =>
        isolate(
          Touch,
          touchProps.note,
        )({ DOM$, props$: xs.of(touchProps) }),
      ),
    )

  const vdom$ = touches$
    .map(touches => xs.combine(...touches.map(t => t.DOM$)))
    .flatten()
    .map(dom => ul('.piano', dom))

  const note$ = touches$
    .map(touches => xs.merge(...touches.map(t => t.NOTE$)))
    .flatten()

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
