import { div } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT } from '../../constants'
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
  const animation$ = xs.merge(
    NOTE$ || xs.empty(),
    MUSIC$ || xs.empty(),
    MUSICS$ || xs.empty(),
    HTTP$ || xs.empty(),
  ).map(() => {
    const steps = []
    for (let i = 0; i < STEPS; i += 1) {
      const stepEvent = xs.of({ step: i, stop: (i === STEPS - 1) })
      steps.push(addDelay(stepEvent, STEP_TIMEOUT * i))
    }
    return xs.merge(...steps)
  })
  .flatten()
  .startWith({ stop: true }) // doesn't show at first

  const vdom$ = animation$
    .map(animation => div(`${className} ${animation.stop && '.stop'}`, [
      div(style(!animation.stop, animation.step), content),
    ]))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$),
    MUSICS$: addDelay(MUSICS$),
    NOTE$: addDelay(NOTE$),
    HTTP$: addDelay(HTTP$),
  }
}
