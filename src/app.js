import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import { Instrument } from './components'
import { Campfire } from './component'

const randomFrequency = () => Math.round(Math.random() * 1000) + 200

export function App(sources) {
  const instruments = [
    { frequency: randomFrequency() },
    { name: 'guitare', frequency: randomFrequency() },
    { name: 'piano', frequency: randomFrequency() },
    { name: 'ocarina', frequency: randomFrequency() },
    { name: 'tamtam', frequency: randomFrequency() },
  ].map(props => isolate(Instrument)({ DOM$: sources.DOM$, props$: xs.of(props) }))
  const campfire = Campfire(sources)

  const animation$ = campfire.ANIMATION$

  const vdom$ = xs
    .combine(...instruments.map(i => i.DOM$), campfire.DOM$)
    .map(instrumentDoms => div(instrumentDoms))

  const music$ = xs
    .merge(...instruments.map(i => i.MUSIC$))

  const sinks = {
    DOM$: vdom$,
    MUSIC$: music$,
    ANIMATION$: xs.merge(sources.ANIMATION$, animation$),
  }

  return sinks
}
