import { img } from '@cycle/dom'
import { getNumber, getClassNameFromNumber } from '../../../utils'

const model = ({ MUSIC$ }) => getNumber(MUSIC$)

const view = state$ => (
  state$
    .map(number => (
      img(
        `.speaker ${getClassNameFromNumber(number)}`,
        { props: { src: 'svg/drivers/speaker.svg' } },
      )
    ))
)

export default (sources) => {
  return {
    DOM: view(model(sources)),
    MUSIC$: sources.MUSIC$, // Speaker doesn't transform the music, it just 'prints' it
  }
}
