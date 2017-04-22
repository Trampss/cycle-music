import { div } from '@cycle/dom'
import xs from 'xstream'
import Instrument from './components/instrument'

export function App (sources) {

  const instrument = Instrument({DOM$: sources.DOM$})

  const sinks = {
    DOM$: instrument.DOM$,
    MUSIC$: instrument.MUSIC$,
  }

  return sinks
}
