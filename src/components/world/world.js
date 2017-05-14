import xs from 'xstream'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import Rythmbox from '../rythmbox'
import Merge from '../merge'
import Character from '../character'
import Wire from '../wire'
import { CHARACTERS } from '../../config'

export default ({ DOM$ }) => {
  // Create Rythmbox
  const rythmbox = Rythmbox({ DOM$, props$: xs.of(CHARACTERS) })

  // Create Characters object and connect with environment - between rythmbox and speaker -
  const connectedCharacters = CHARACTERS
  // Create note wire - between rythmbox and character -
  .map(props => ({
    wireNote: isolate(Wire, `wireNote-${props.name}`)({ NOTE$: rythmbox.NOTE$ }),
    props,
  }))
  // Create Character connected to note wire
  .map(({ wireNote, props }) => {
    const character = isolate(Character, `character-${props.name}`)({ NOTE$: wireNote.NOTE$, props$: xs.of(props) })
    return Object.assign({}, { wireNote, props }, { character })
  })
  // Create music wire - connected after character -
  .map(({ wireNote, character, props }) => {
    const wireMusic = isolate(Wire, `wireMusic-${props.name}`)({ MUSIC$: character.MUSIC$ })
    return Object.assign({}, { wireNote, character, props }, { wireMusic })
  })

  // Merge Music wire
  const merge = Merge({ MUSICS: connectedCharacters.map(({ wireMusic }) => wireMusic.MUSIC$) })
  const wireMusics = Wire({ MUSICS$: merge.MUSICS$ })

  // Draw DOM with all Component
  // Transform character object to flow of dom - Dom of wireNote, character and wireMusic -
  const toCharacterDom$ = ({ wireNote, character, wireMusic }) =>
    xs.combine(wireNote.DOM$, character.DOM$, wireMusic.DOM$).map(c => div('.player', c))

  // Combine all flow of Dom character to one div
  const charactersDom$ = xs.combine(
    ...connectedCharacters.map(toCharacterDom$),
  ).map(cs => div('.characters', cs))

  const mergeDom$ = xs.combine(
    merge.DOM$,
    wireMusics.DOM$,
  )
    .map(mergeDom => div('.merge', mergeDom))

  // Combine all dom component
  const vdom$ = xs
  .combine(
    rythmbox.DOM$,
    charactersDom$,
    mergeDom$,
  )
  .map(worldDom => div('.world', worldDom))

  return {
    DOM$: vdom$,
    MUSIC$: wireMusics.MUSICS$,
  }
}
