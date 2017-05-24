import { div, img } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT, STOP_EVENT } from '../../../constants'
import { addDelay } from '../../../utils'

const STEPS = 15
const STEP_TIMEOUT = ANIMATION_TIMEOUT / STEPS
const step = (a, i) => (a ? i * 2 : 0)
const flow = i => (i % 2 === 0 ? 1 : -1)
const translateX = (a, i) => `translateX(${step(a, i)}vw) translateY(${flow(i)}vh)`
const translateY = (a, i) => `translateY(${step(a, i)}vh) translateX(${flow(i)}vw)`
const style = (animate, direction, i) => ({
  visibility: animate ? 'visible' : 'hidden',
  transition: `transform ${STEP_TIMEOUT}ms`,
  transform: animate && direction === 'top' ? translateX(animate, i) : translateY(animate, -i),
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
      ...event,
      direction: event.type === 'musics' ? 'top' : 'right',
    }))
  })
  .flatten()
  .startWith(STOP_EVENT)
)

const view = state$ =>
  state$.map(state => div(`.wire ${state.type} ${state.stop && '.stop'}`, [
    img({
      style: style(!state.stop, state.direction, state.step),
      props: { src: `/svg/notes/${state.type}.svg` },
    }),
  ]))

const mergeStream = ({ NOTE$, MUSIC$, MUSICS$ }) =>
  xs.merge(
    (NOTE$ || xs.empty()).map(() => ({ type: 'note' })),
    (MUSIC$ || xs.empty()).map(() => ({ type: 'music' })),
    (MUSICS$ || xs.empty()).map(() => ({ type: 'musics' })),
  )

export default (sources) => {
  return {
    DOM$: view(model(mergeStream(sources))),
    MUSIC$: addDelay(sources.MUSIC$),
    MUSICS$: addDelay(sources.MUSICS$),
    NOTE$: addDelay(sources.NOTE$),
  }
}
