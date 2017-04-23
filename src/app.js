import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import { Instrument } from './components'

export function App({ DOM$ }) {
  const randomFrequency = () => Math.round(Math.random() * 1000) + 200

  const instruments = [
    { c: isolate(Instrument), frequency: randomFrequency() },
    { c: isolate(Instrument), name: 'guitare', frequency: randomFrequency() },
    { c: isolate(Instrument), name: 'piano', frequency: randomFrequency() },
    { c: isolate(Instrument), name: 'ocarina', frequency: randomFrequency() },
    { c: isolate(Instrument), name: 'tamtam', frequency: randomFrequency() },
  ].map(({ c, name, frequency }) => c({ DOM$, props$: xs.of({ name, frequency }) }))

  const vdom$ = xs
    .combine(...instruments.map(i => i.DOM$))
    .map(iDom => div(iDom))

  const music$ = xs
    .merge(...instruments.map(i => i.MUSIC$))

  const sinks = {
    DOM$: vdom$,
    MUSIC$: music$,
  }

  return sinks
}
