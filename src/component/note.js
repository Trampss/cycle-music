import xs from 'xstream'
import { svg } from '@cycle/dom'

export default ({ DOM$, ANIMATION$, props$ }) => {
  const vdom$ = props$.map(props => svg.circle(
    props.id,
    { attrs: { r: props.r, fill: props.fill } }
  ))

  const animation$ = xs
    .combine(
      props$,
      ANIMATION$.startWith({
        done: true
      }),
    )
    .map(([props, animation]) => ({ props, animation }))
    .filter(obj => !obj.animation.id || obj.props.id === obj.animation.id)
    .filter(obj => obj.animation.done)
    .map(obj => ({
      follower: {
        id: obj.props.id,
      },
    }))

  return {
    DOM$: vdom$,
    ANIMATION$: animation$,
  }
}
