import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from '../rythmbox/index'
import Character from '../character/index'
import Wire from '../wire'
import Speaker from '../speaker/index'
import { CHARACTERS } from '../../config'

export default ({ DOM$ }) => {
  /*
  Create Rythmbox
   */
  const rythmbox = Rythmbox({ DOM$, props$: xs.of(CHARACTERS) })

  /*
  Connect Character with Rythmbox by Wire
 */
  const connectedCharacters = CHARACTERS
    .map(props => ({
      wireNote: isolate(Wire, `wireNote-${props.name}`)({ NOTE$: rythmbox.NOTE$ }),
      props,
    }))
    .map(({ wireNote, props }) => {
      const character = isolate(Character, `character-${props.name}`)(
        {
          NOTE$: wireNote.NOTE$,
          props$: xs.of(props),
        },
      )

      return Object.assign({}, { wireNote, props }, { character })
    })
    .map(({ wireNote, character, props }) => {
      const wireMusic = isolate(Wire, `wireMusic-${props.name}`)({ MUSIC$: character.MUSIC$ })

      return Object.assign({}, { wireNote, character, props }, { wireMusic })
    })

  /*
  Create Speaker
   */
  const speaker = Speaker({
    MUSIC$: xs.merge(...connectedCharacters.map(({ wireMusic }) => wireMusic.MUSIC$)),
  })

  /*
  Draw DOM with all Component
   */
  const characters = div(
    '.characters',
    connectedCharacters.map(({ wireNote, character, wireMusic }) =>
      div('.character', xs.combine(wireNote.DOM$, character.DOM$, wireMusic.DOM$).debug())),
  )

  const vdom$ = xs
    .combine(
      rythmbox.DOM$,
      xs.of(connectedCharacters),
      speaker.DOM$,
    )
    .map(([rd, c, sd]) =>
      div([
        rd,
        div(
          '.characters',
          c.map(({ wireNote, character, wireMusic }) =>
            div('.character', xs.combine(wireNote.DOM$, character.DOM$, wireMusic.DOM$))),
        ),
        sd,
      ]))

  return {
    DOM$: vdom$,
    MUSIC$: speaker.MUSIC$,
  }
}

