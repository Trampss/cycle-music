import xs from 'xstream'
import isolate from '@cycle/isolate'
import { div, input } from '@cycle/dom'
import { NOTES } from '../../config'
import Piano from './piano'

export default ({ DOM$, props$ }) => {
  // Create characters component with props
  const piano = isolate(Piano, 'piano')({ DOM$, props$: xs.of({ notes: NOTES }) })

  const change = name => DOM$
    .select(`input.${name}`)
    .events('change')
    .map(e => e.target.checked)
    .startWith(false)

  const vdom$ = xs
    .combine(piano.DOM$, props$)
    .map(([pianoDom, props]) => div('.rythmbox', [
      div('.players', [...props.map(({ name }) => div([input(`.${name}`, { attrs: { type: 'checkbox' } }), name]))]),
      pianoDom,
    ]))

  const characters$ = xs.combine(
    change('goron'),
    change('zora'),
    change('mojo'),
    change('link'),
  )
    .map(([goron, zora, mojo, link]) => ({ goron, zora, mojo, link }))
    .startWith({})

  // add character to note
  const note$ = xs
    .combine(
      characters$,
      piano.NOTE$)
    .map(([c, note]) => Object.assign({}, note, { characters: c }))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
