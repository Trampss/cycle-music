import makeDom from './instrument.dom'

const music = ({ NOTE$, props }) => (
  NOTE$
    .map(note => ({ ...note, instrument: props.instrument }))
)

export default (sources) => {
  return {
    DOM$: makeDom(sources),
    MUSIC$: music(sources),
  }
}
