import { div } from '@cycle/dom'
import xs from 'xstream'

/**
 *
 * @param STREAM$ any Stream
 * @param props$ : startPosition{x, y}, radius, length, color, animateColor
 * @returns {{STREAM$: *}}
 */
export default ({ STREAM$, props$ }) => {
  const className = '.wire'

  const component = (props, isNotify) => div(
    `${className} ${isNotify && '.notify'}`,
    {
      style: {
        transformOrigin: 'left',
        transform: `rotateZ(${props.radius}deg)`,
        border: 'dashed darkblue 1px',
        width: `${props.length}px`,
        position: 'absolute',
        top: `${props.startPosition.y}px`,
        left: `${props.startPosition.x}px`,
      },
    },
  )

  const vdom$ = props$
  .map(props => component(props))

  return {
    DOM$: vdom$,
    STREAM$,
  }
}
