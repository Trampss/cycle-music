import xs from 'xstream'
import isolate from '@cycle/isolate'
import { div, input } from '@cycle/dom'
import { NOTES } from '../../../constants'
import Piano from './piano'

const intents = ({ DOM$ }) => {
  const change = name => DOM$
    .select(`input.${name}`)
    .events('change')
    .map(e => e.target.checked)

  return {
    goronSelected$: change('goron'),
    zoraSelected$: change('zora'),
    mojoSelected$: change('mojo'),
    linkSelected$: change('link'),
  }
}

const selectedCharacters = actions => (
  xs
    .merge(
        actions.goronSelected$.map(selected => ({ goron: selected })),
        actions.zoraSelected$.map(selected => ({ zora: selected })),
        actions.mojoSelected$.map(selected => ({ mojo: selected })),
        actions.linkSelected$.map(selected => ({ link: selected })),
      )
      .fold(
        (acc, curr) => ({ ...acc, ...curr }),
        { goron: false, zora: false, mojo: false, link: false },
      )
)

const characterNote = pianoNote$ => state$ => (
  xs
    .combine(
      state$
        // only trigger an event if one of the character is selected
        .filter(characters => (
          characters.goron ||
          characters.zora ||
          characters.mojo ||
          characters.link
        )),
      pianoNote$,
    )
    .map(([characters, note]) => ({
      // note
      ...note,
      // only the characters that are selected
      characters: Object.keys(characters).filter(name => characters[name]),
    }))
)

const view = pianoDom$ => ({ props$ }) => (
  xs.combine(
    props$,
    pianoDom$,
  )
    .map(([props, children]) => div('.rythmbox', [
      div('.players', [...props.map(({ name }) => div([input(`.${name}`, { attrs: { type: 'checkbox' } }), name]))]),
      children,
    ]))
)

export default (sources) => {
  const piano = isolate(Piano, 'piano')({ DOM$: sources.DOM$, props$: xs.of({ notes: NOTES }) })


  return {
    DOM$: view(piano.DOM$)(sources),
    NOTE$: characterNote(piano.NOTE$)(selectedCharacters(intents(sources))).debug('note'),
  }
}
