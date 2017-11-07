import xs from 'xstream'
import { div } from '@cycle/dom'
import { NOTES, CHARACTERS } from '../../../constants'
import Piano from './piano'
import Characters from './characters'

const note = piano => characters => (
  xs
    .combine(
      characters.state$,
      piano.NOTE$,
    )
    .map(([charactersState, pianoNote]) => ({
      // note
      ...pianoNote,
      // only the characters that are selected
      characters: Object.keys(charactersState).filter(name => charactersState[name]),
    }))
)

const view = piano => characters => () => (
  xs
    .combine(characters.DOM, piano.DOM)
    .map(children => div('.rythmbox', children))
)

export default (sources) => {
  const piano = Piano({ DOM: sources.DOM, props$: xs.of({ notes: NOTES }) })
  const characters = Characters({ DOM: sources.DOM, props$: xs.of({ characters: CHARACTERS }) })

  return {
    DOM: view(piano)(characters)(sources),
    NOTE$: note(piano)(characters),
  }
}
