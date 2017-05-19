import { img } from '@cycle/dom'
import xs from 'xstream'
import { getNumber, getClassNameFromNumber, addDelay } from '../../utils'

const music = ({ NOTE$, props$ }) => (
  addDelay(xs
    .combine(NOTE$, props$)
    .map(([note, props]) => ({ ...note, instrument: props.instrument })),
  )
)

const model = ({ NOTE$, props$ }) => xs.combine(props$, getNumber(NOTE$))

const view = state$ => (
  state$
    .map(([props, number]) => img(
      `.instrument ${getClassNameFromNumber(number)}`,
      { props: { src: `/svg/instruments/${props.instrument}.svg` } },
    ))
)

export default (sources) => {
  return {
    DOM$: view(model(sources)),
    MUSIC$: music(sources),
  }
}
