import { div } from '@cycle/dom'
import xs from 'xstream'
import Instrument from './components/instrument'

export function App (sources) {

  const instrument = Instrument({DOM$: sources.DOM$})

  const music$ = xs.periodic(200).map(() => {
    return {
      frequency: (Math.random() * 1000) + 300,
      time: (Math.random() * 1000) + 200,
    }
  })

  const sinks = {
    DOM$: instrument.DOM$,
    MUSIC$: music$,
  }

  return sinks
}
