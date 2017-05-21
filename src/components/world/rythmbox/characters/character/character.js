import xs from 'xstream'
import { div, input } from '@cycle/dom'

const intents = ({ DOM$, props$ }) => {
  return {
    selected$:
      props$
        .map(props => (
          DOM$
            .select(`input.${props.name}`)
            .events('change')
            .map(e => e.target.checked)
        ))
        .flatten()
        .startWith(false),
  }
}

const model = props$ => actions => (
  xs
    .combine(props$, actions.selected$)
    .map(([props, selected]) => ({ [props.name]: selected }))
)

const view = props$ => () => (
  props$
    .map(props => div([input(`.${props.name}`, { attrs: { type: 'checkbox' } }), props.name]))
)

export default (sources) => {
  const state$ = model(sources.props$)(intents(sources))

  return {
    DOM$: view(sources.props$)(state$),
    state$,
  }
}
