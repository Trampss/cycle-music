import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from './components/rythmbox'
import Character from './components/character'
import Speaker from './components/speaker'

export function App({ DOM$ }) {
  const rythmbox = Rythmbox({ DOM$ })

  const charactersProps = [
    { name: 'Zora', instrument: 'harp', wire: { startPosition: { x: 200, y: 500 }, radius: -45 } },
    { name: 'Goron', instrument: 'bass', wire: { startPosition: { x: 400, y: 500 }, radius: 225 } },
    { name: 'Mojo', instrument: 'guitare', wire: { startPosition: { x: 200, y: 300 }, radius: 45 } },
    { name: 'Link', instrument: 'ocarina', wire: { startPosition: { x: 400, y: 300 }, radius: 135 } },
  ]

  const characters = charactersProps.map(props =>
    isolate(Character, `${props.name}-${props.instrument}`)(
      {
        NOTE$: rythmbox.NOTE$,
        props$: xs.of(props),
      },
    ))

  const speaker = Speaker({ MUSIC$: xs.merge(...characters.map(c => c.MUSIC$)) })

  const vdom$ = xs
    .combine(
      rythmbox.DOM$,
      ...characters.map(c => c.DOM$),
      speaker.DOM$,
    )
    .map(components => div(components))

  const music$ = speaker.MUSIC$

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
