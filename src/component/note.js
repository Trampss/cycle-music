import xs from 'xstream'
import { svg } from '@cycle/dom'

export default ({ DOM$, ANIMATION$, props$ }) => {
  const vdom$ = props$.map(props => svg.circle(
    props.id,
    { attrs: { r: props.r, fill: props.fill } }
  ))

  const animation$ = props$.map(props => ({ follower: { id: props.id, delay: props.delay } }))

  return {
    DOM$: vdom$,
    ANIMATION$: animation$,
  }
}
