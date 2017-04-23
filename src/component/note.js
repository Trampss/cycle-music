import xs from 'xstream'
import { svg } from '@cycle/dom'

export default ({ DOM$, ANIMATION$, props$ }) => {
  const vdom$ = props$.map(props => svg.circle(
    props.id,
    { attrs: { r: '10px', fill: 'red' } }
  ))

  const animation$ = props$.map(props => ({ follower: { id: props.id } }))

  return {
    DOM$: vdom$,
    ANIMATION$: animation$,
  }
}
