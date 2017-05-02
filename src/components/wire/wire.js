import { div } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

/**
 *
 * @param STREAM$ any Stream
 * @param props$ : startPosition{x, y}, radius, length, color, animateColor
 * @returns {{STREAM$: *}}
 */
export default ({ STREAM$, props$ }) => {
  const className = '.wire'

  const component = (props, stop) => div(
    `${className} ${stop && '.stop'}`,
    {
      style: {
        transformOrigin: 'left',
        transform: `rotateZ(${props.radius}deg)`,
        border: stop ? `dashed ${props.color} 1px` : `solid ${props.colorAnimate} 2px`,
        width: `${props.length}px`,
        position: 'absolute',
        top: `${props.startPosition.y}px`,
        left: `${props.startPosition.x}px`,
      },
    },
  )

  // Add a 'stop' event
  const start$ = STREAM$
  const stop$ = STREAM$
    .map(s => xs.of(s).compose(delay(200)))
    .flatten()
    .map(s => Object.assign({}, s, { stop: true }))

  const stream$ = xs.merge(start$, stop$)

  const vdom$ = xs.combine(props$, stream$.startWith({ stop: true }))
    .map(([props, stream]) => component(props, stream.stop))

  return {
    DOM$: vdom$,
    STREAM$,
  }
}
