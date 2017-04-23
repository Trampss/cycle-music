import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import { Instrument } from './components'

const randomFrequency = () => Math.round(Math.random() * 1000) + 200

export function App({ DOM$ }) {
  const instruments = [
    { frequency: randomFrequency() },
    { name: 'guitare', frequency: randomFrequency() },
    { name: 'piano', frequency: randomFrequency() },
    { name: 'ocarina', frequency: randomFrequency() },
    { name: 'tamtam', frequency: randomFrequency() },
  ].map(props => isolate(Instrument)({ DOM$, props$: xs.of(props) }))

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
