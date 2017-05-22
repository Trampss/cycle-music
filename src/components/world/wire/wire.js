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
const getContent = type => `${type === 'musics' ? '🎶🎶' : ''} ${type === 'music' ? '🎶' : ''} ${type === 'note' ? '🎵' : ''}`
const style = (animate, translate, i) => ({
  style: {
    visibility: animate ? 'visible' : 'hidden',
    transition: `transform ${STEP_TIMEOUT}ms`,
    transform: animate && translate(animate, i),
  },
})

const model = actions => (
  actions
  .map((event) => {
    const steps = []
    for (let i = 0; i < STEPS; i += 1) {
      const stepEvent = xs.of({ step: i, stop: (i === STEPS - 1) })
      steps.push(addDelay(stepEvent, STEP_TIMEOUT * i))
    }
    return xs
    .merge(...steps)
    .map(s => ({
      ...s,
      className: `.wire .${event.type}`,
      content: getContent(event.type),
      translate: (a, i) => (event.type === 'musics' ? translateX(a, i) : translateY(a, -i)),
    }))
  })
  .flatten()
  .startWith(STOP_EVENT)
)

const view = state$ =>
  state$.map(state => div(`${state.className} ${state.stop && '.stop'}`, [
    div(style(!state.stop, state.translate, state.step), state.content),
  ]))

export default ({ NOTE$, MUSIC$, MUSICS$ }) => {
  const sources = xs.merge(
    (NOTE$ || xs.empty()).map(() => ({ type: 'note' })),
    (MUSIC$ || xs.empty()).map(() => ({ type: 'music' })),
    (MUSICS$ || xs.empty()).map(() => ({ type: 'musics' })),
  )

  return {
    DOM$: view(model(sources)),
    MUSIC$: addDelay(MUSIC$),
    MUSICS$: addDelay(MUSICS$),
    NOTE$: addDelay(NOTE$),
  }
}
