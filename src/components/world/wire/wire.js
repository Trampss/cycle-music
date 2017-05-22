import { div } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT, STOP_EVENT } from '../../../constants'
import { addDelay } from '../../../utils'

const STEPS = 15
const STEP_TIMEOUT = ANIMATION_TIMEOUT / STEPS
const step = (a, i) => (a ? i * 2 : 0)
const flow = i => (i % 2 === 0 ? 1 : -1)
const translateX = (a, i) => `translateX(${step(a, i)}vw) translateY(${flow(i)}vh)`
const translateY = (a, i) => `translateY(${step(a, i)}vh) translateX(${flow(i)}vw)`

const intent = ({ NOTE$, MUSIC$, MUSICS$ }) =>
  xs.merge(
    NOTE$ || xs.empty(),
    MUSIC$ || xs.empty(),
    MUSICS$ || xs.empty(),
  ).map(stream => ({
    stream,
    className: `.wire ${MUSIC$ ? '.music' : ''} ${NOTE$ ? '.note' : ''}`,
    content: `${MUSICS$ ? '🎶🎶' : ''} ${MUSIC$ ? '🎶' : ''} ${NOTE$ ? '🎵' : ''}`,
    translate: (a, i) =>
      `${MUSICS$ ? translateX(a, i) : ''} ${MUSIC$ ? translateY(a, -i) : ''} ${NOTE$ ? translateY(a, -i) : ''}`,
  }))

const model = actions => (
  actions
    .map((event) => {
      const steps = []
      for (let i = 0; i < STEPS; i += 1) {
        const stepEvent = xs.of({ step: i, stop: (i === STEPS - 1) })
        steps.push(addDelay(stepEvent, STEP_TIMEOUT * i))
      }
      return xs.merge(...steps).map(s => ({ ...s, ...event }))
    })
    .flatten()
    .startWith(STOP_EVENT)
)

const view = (state$) => {
  const style = (animate, translate, i) => ({
    style: {
      visibility: animate ? 'visible' : 'hidden',
      transition: `transform ${STEP_TIMEOUT}ms`,
      transform: animate && translate(animate, i),
    },
  })

  return state$
    .map(state => div(`${state.className} ${state.stop && '.stop'}`, [
      div(style(!state.stop, state.translate, state.step), state.content),
    ]))
}

export default (sources) => {
  return {
    DOM$: view(model(intent(sources))),
    MUSIC$: addDelay(sources.MUSIC$),
    MUSICS$: addDelay(sources.MUSICS$),
    NOTE$: addDelay(sources.NOTE$),
  }
}
