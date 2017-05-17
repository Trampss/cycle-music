import { div } from '@cycle/dom'
import xs from 'xstream'
import { WIRE_TIMEOUT } from '../../config'
import { STOP_EVENT } from '../../constant'
import { addDelay } from '../../utils'

export default ({ NOTE$, MUSIC$, MUSICS$, HTTP$ }) => {
  const className = `.wire ${MUSIC$ ? '.music' : ''} ${NOTE$ ? '.note' : ''} ${HTTP$ ? '.http' : ''}`
  const content = `${MUSICS$ ? '🎶🎶' : ''} ${MUSIC$ ? '🎶' : ''} ${NOTE$ ? '🎵' : ''} ${HTTP$ ? '💩' : ''}`
  const step = (a, i) => (a ? i * 2 : 0)
  const flow = i => (i % 2 === 0 ? 1 : -1)
  const translateX = (a, i) => `translateX(${step(a, i)}vw) translateY(${flow(i)}vh)`
  const translateY = (a, i) => `translateY(${step(a, i)}vh) translateX(${flow(i)}vw)`
  const translate = (a, i) => `${MUSICS$ ? translateX(a, i) : ''} ${MUSIC$ ? translateY(a, -i) : ''} ${NOTE$ ? translateY(a, -i) : ''}`

  const time = 15
  const period = WIRE_TIMEOUT / time
  const style = (animate, i) => ({
    style: {
      visibility: animate ? 'visible' : 'hidden',
      transition: `transform ${period}ms`,
      transform: animate && translate(animate, i),
    },
  })

  const start$ = xs.merge(
    NOTE$ || xs.empty(),
    MUSIC$ || xs.empty(),
    MUSICS$ || xs.empty(),
    HTTP$ || xs.empty(),
  ).map(s => (Object.assign({}, s, { periodic: xs.periodic(period) })))

  // Add a 'stop' event after timeout
  const stop$ = addDelay(start$, WIRE_TIMEOUT)
    .map(() => STOP_EVENT)

  const merge$ = xs.merge(start$, stop$)
    .startWith(STOP_EVENT)

  const periodic$ = merge$
    .map(m => m.periodic || xs.empty())
    .flatten()
    .startWith(0)

  const vdom$ = xs.combine(merge$, periodic$).debug()
    .map(([s, i]) => {
      return div(`${className} ${s.stop && '.stop'}`, [
        div(style(!s.stop && i < time - 1, i), content),
      ])
    },
  )

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$, WIRE_TIMEOUT),
    MUSICS$: addDelay(MUSICS$, WIRE_TIMEOUT),
    NOTE$: addDelay(NOTE$, WIRE_TIMEOUT),
    HTTP$: addDelay(HTTP$, WIRE_TIMEOUT),
  }
}
