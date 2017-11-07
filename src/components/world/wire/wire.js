import { div, img } from '@cycle/dom'
import xs from 'xstream'
import { ANIMATION_TIMEOUT } from '../../../constants'
import { addDelay } from '../../../utils'

const STEPS = 15
const STEP_TIMEOUT = ANIMATION_TIMEOUT / STEPS
const getStep = (stop, step) => (stop ? 0 : step * 2)
const flow = step => (step % 2 === 0 ? 1 : -1)
const translateX = (stop, step) => `translateX(${getStep(stop, step)}vw) translateY(${flow(step)}vh)`
const translateY = (stop, step) => `translateY(${getStep(stop, step)}vh) translateX(${flow(step)}vw)`
const style = ({ stop, step, type }) => ({
  visibility: stop ? 'hidden' : 'visible',
  transition: `transform ${STEP_TIMEOUT}ms`,
  transform: !stop && type === 'musics' ? translateX(stop, step) : translateY(stop, -step),
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
    }))
  })
  .flatten()
    .startWith({ stop: true })
)

const view = state$ =>
  state$.map(state => div(`.wire ${state.type} ${state.stop && '.stop'}`, [
    img({
      style: style(state),
      props: { src: `/svg/notes/${state.type}.svg` },
    }),
  ]))

const mergeStream = ({ NOTE$, MUSIC$, MUSICS$ }) =>
  xs.merge(
    (NOTE$ || xs.empty()).mapTo({ type: 'note' }),
    (MUSIC$ || xs.empty()).mapTo({ type: 'music' }),
    (MUSICS$ || xs.empty()).mapTo({ type: 'musics' }),
  )

export default (sources) => {
  return {
    DOM: view(model(mergeStream(sources))),
    MUSIC$: addDelay(sources.MUSIC$),
    MUSICS$: addDelay(sources.MUSICS$),
    NOTE$: addDelay(sources.NOTE$),
  }
}
