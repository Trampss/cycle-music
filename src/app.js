import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from './components/rythmbox'
import Character from './components/character'

export function App({ DOM$ }) {
  const rythmbox = Rythmbox({ DOM$ })

  const charactersProps = [
    { name: 'Zora', instrument: 'harp' },
    { name: 'Goron', instrument: 'bass' },
    { name: 'Mojo', instrument: 'guitare' },
    { name: 'Link', instrument: 'ocarina' },
  ]

  const characters = charactersProps.map(props =>
    isolate(Character, `${props.name}-${props.instrument}`)(
      {
        NOTE$: rythmbox.NOTE$,
        props$: xs.of(props),
      },
    ))

  const vdom$ = xs.combine(rythmbox.DOM$, ...characters.map(c => c.DOM$))
    .map(components => div(components))

  const music$ = xs.merge(...characters.map(c => c.MUSIC$))

  const sinks = {
    DOM$: vdom$,
    MUSIC$: music$,
  }

  return sinks
}
