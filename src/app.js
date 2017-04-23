import { div } from '@cycle/dom'
import xs from 'xstream'
import Instrument from './components/instrument'

export function App (sources) {

  /*const instrument = Instrument({
    DOM$: sources.DOM$,
    props$: xs.of({name: 'guitare', frequency: Math.round(Math.random()*1000) + 200})
  })*/

  const randomFrequency = () => Math.round(Math.random()*1000) + 200

  const instruments$ = xs.fromArray(
    [
      {name: 'guitare', frequency: randomFrequency()},
      {name: 'piano', frequency: randomFrequency()},
      {name: 'ocarina', frequency: randomFrequency()},
      {name: 'tamtam', frequency: randomFrequency()},
    ]
  )

  const instruments = instruments$
    .map(instrument$ => Instrument({DOM$: sources.DOM$, props$: instrument$})).debug().flatten()

  const sinks = {
    DOM$: instruments.DOM$,
    MUSIC$: instruments.MUSIC$,
  }

  return sinks
}
