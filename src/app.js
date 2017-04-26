import xs from 'xstream'

import Rythmbox from './components/rythmbox'
import Character from './components/character'

export function App({ DOM$ }) {
  const rythmbox = Rythmbox({ DOM$ })

  const goron = Character({
    NOTE$: rythmbox.NOTE$,
    props$: xs.of({ name: 'goron', instrument: 'bass' }),
  })

  const zora = Character({
    NOTE$: rythmbox.NOTE$,
    props$: xs.of({ name: 'zora', instrument: 'harp' }),
  })

  const vdom$ = rythmbox.DOM$
  const music$ = xs.merge(goron.MUSIC$, zora.MUSIC$).debug()

  const sinks = {
    DOM$: vdom$,
    MUSIC$: music$,
  }

  return sinks
}
