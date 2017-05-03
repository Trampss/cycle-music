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
  const tempo = 1000

  const component = (props, stop) => div(
    `${className} ${stop && '.stop'}`,
  )

  // Add a 'stop' event
  const start$ = STREAM$
  const stop$ = STREAM$
    .map(s => xs.of(s).compose(delay(tempo)))
    .flatten()
    .map(s => Object.assign({}, s, { stop: true }))

  const stream$ = xs.merge(start$, stop$)

  const vdom$ = xs.combine(props$, stream$.startWith({ stop: true }))
    .map(([props, stream]) => component(props, stream.stop))

  return {
    DOM$: vdom$,
    STREAM$: STREAM$.compose(delay(tempo)),
  }
}
