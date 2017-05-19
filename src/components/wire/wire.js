import { div } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT, STOP_EVENT } from '../../constants'
import { addDelay } from '../../utils'

const STEPS = 15
const STEP_TIMEOUT = ANIMATION_TIMEOUT / STEPS

const step = (a, i) => (a ? i * 2 : 0)
const flow = i => (i % 2 === 0 ? 1 : -1)
const translateX = (a, i) => `translateX(${step(a, i)}vw) translateY(${flow(i)}vh)`
const translateY = (a, i) => `translateY(${step(a, i)}vh) translateX(${flow(i)}vw)`

export default ({ NOTE$, MUSIC$, MUSICS$, HTTP$ }) => {
  const className = `.wire ${MUSIC$ ? '.music' : ''} ${NOTE$ ? '.note' : ''} ${HTTP$ ? '.http' : ''}`
  const content = `${MUSICS$ ? '🎶🎶' : ''} ${MUSIC$ ? '🎶' : ''} ${NOTE$ ? '🎵' : ''} ${HTTP$ ? '💩' : ''}`
  const translate = (a, i) => `${MUSICS$ ? translateX(a, i) : ''} ${MUSIC$ ? translateY(a, -i) : ''} ${NOTE$ ? translateY(a, -i) : ''}`

  const style = (animate, i) => ({
    style: {
      visibility: animate ? 'visible' : 'hidden',
      transition: `transform ${STEP_TIMEOUT}ms`,
      transform: animate && translate(animate, i),
    },
  })

  // animation stream
  // - start
  const start$ = xs.merge(
    NOTE$ || xs.empty(),
    MUSIC$ || xs.empty(),
    MUSICS$ || xs.empty(),
    HTTP$ || xs.empty(),
  ).map(s => (Object.assign({}, s, { periodic: xs.periodic(STEP_TIMEOUT) })))
  // - stop
  const stop$ = addDelay(start$, ANIMATION_TIMEOUT)
  // - animation stream
  const animation$ = xs.merge(start$, stop$)
    .startWith(STOP_EVENT)

  // add steps to animation stream
  const periodic$ = animation$
    .map(m => m.periodic || xs.empty())
    .flatten()
    .startWith(0)
    .debug('periodic') // FIXME : this debug shows that we have a problem there : periodic doesn't stop

  const vdom$ = xs.combine(animation$, periodic$)
    .map(([animation, i]) => {
      return div(`${className} ${animation.stop && '.stop'}`, [
        div(style(!animation.stop && i < STEPS - 1, i), content),
      ])
    },
  )

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$),
    MUSICS$: addDelay(MUSICS$),
    NOTE$: addDelay(NOTE$),
    HTTP$: addDelay(HTTP$),
  }
}
