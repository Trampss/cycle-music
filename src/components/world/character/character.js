import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Instrument from './instrument'
import { getNumber, getClassNameFromNumber } from '../../../utils'

const filter = ({ NOTE$, props$ }) => {
  return {
    props$,
    NOTE$: xs
      .combine(NOTE$, props$)
      .filter(([note, props]) => note.characters.includes(props.name))
      .map(([note]) => note),
  }
}

const model = instrument => ({ props$, NOTE$ }) => (
  xs
    .combine(
      props$,
      getNumber(NOTE$),
      instrument.DOM$,
    )
)

const view = state$ => (
  state$.map(([props, number, children]) =>
    div(`.${props.name}`,
      [
        img(
          `.character ${getClassNameFromNumber(number)}`,
          { props: { src: `/svg/characters/${props.name}.svg` } },
        ),
        children,
      ],
    ),
  )
)

export default (sources) => {
  const filteredSources = filter(sources)
  const instrument = Instrument(filteredSources)

  return {
    DOM$: view(model(instrument)(filteredSources)), // combine all flow of dom
    MUSIC$: instrument.MUSIC$, // return flow of Music Wire
  }
}
