import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from './components/rythmbox'
import Character from './components/character'
import Speaker from './components/speaker'

export function App({ DOM$ }) {
  const rythmbox = Rythmbox({ DOM$ })

  const charactersProps = [
    { name: 'Zora', instrument: 'piano' },
    { name: 'Goron', instrument: 'acoustic' },
    { name: 'Mojo', instrument: 'organ' },
    { name: 'Link', instrument: 'edm' },
  ]

  const characters = charactersProps.map(props =>
    isolate(Character, `${props.name}-${props.instrument}`)(
      {
        NOTE$: rythmbox.NOTE$,
        props$: xs.of(props),
      },
    ))

  const speaker = Speaker({ MUSIC$: xs.merge(...characters.map(c => c.MUSIC$)) })

  const charactersDom$ = xs
    .combine(...characters.map(c => c.DOM$))
    .map(c => div('.characters', c))

  const vdom$ = xs
    .combine(
      rythmbox.DOM$,
      charactersDom$,
      speaker.DOM$,
    )
    .map(components => div(components))

  const music$ = speaker.MUSIC$

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
