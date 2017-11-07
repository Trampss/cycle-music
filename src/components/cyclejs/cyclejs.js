import { img } from '@cycle/dom'
import xs from 'xstream'
import { getNumber, getClassNameFromNumber, addDelay } from '../../utils'

const model = ({ MUSIC$, NOTE$, HTTP$ }) => getNumber(
  xs.merge(
    MUSIC$ || xs.empty(),
    NOTE$ || xs.empty(),
    HTTP$ || xs.empty(),
  ),
)

const view = state$ => (
  state$
    .map(number => (
      img(
        `.cyclejs ${getClassNameFromNumber(number)}`,
        { props: { src: '/svg/libraries/cyclejs.svg' } },
      )
    ))
)

export default (sources) => {
  return {
    DOM: view(model(sources)),
    MUSIC$: addDelay(sources.MUSIC$),
    NOTE$: addDelay(sources.NOTE$),
    HTTP$: addDelay(sources.HTTP$),
  }
}
