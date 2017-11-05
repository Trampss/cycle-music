import xs from 'xstream'
import isolate from '@cycle/isolate'
import { div } from '@cycle/dom'
import Character from './character'

const list = ({ props$, DOM }) => (
  props$
    .map(props => (
      props.characters
        .map(character => (
          isolate(Character, character.name)({ DOM, props$: xs.of(character) })
        ))
    ))
)

const model = children$ => () => (
  children$
    .map(characters => xs.merge(...characters.map(character => character.state$)))
    .flatten()
    .fold(
      (acc, curr) => ({ ...acc, ...curr }),
      { },
    )
)

const view = children$ => () => (
  children$
    .map(characters => xs.combine(...characters.map(character => character.DOM)))
    .flatten()
    .map(children => div('.characters', children))
)

export default (sources) => {
  const children$ = list(sources)
  const state$ = model(children$)()

  return {
    DOM: view(children$)(state$),
    state$,
  }
}
