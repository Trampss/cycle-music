import Instrument from './instrument'
import makeDom from './character.dom'

const filter = ({ NOTE$, props }) => {
  return {
    props,
    NOTE$:
      NOTE$
        .filter(note => note.characters.includes(props.name)),
  }
}

export default (sources) => {
  const filteredSources = filter(sources)
  const instrument = Instrument(filteredSources)

  return {
    DOM$: makeDom(instrument)(filteredSources),
    MUSIC$: instrument.MUSIC$, // return flow of Music Wire
  }
}
