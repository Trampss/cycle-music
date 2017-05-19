import { div, li, span } from '@cycle/dom'
import xs from 'xstream'
import { WITHOUT_SHARP } from '../../../../constants'

const className = '.touch'

const intents = ({ DOM$ }) => {
  const clickTouch$ = DOM$
    .select(className)
    .events('click')

  const clickSharp$ = DOM$
    .select('.sharp')
    .events('click')

  return {
    clickTouch$,
    clickSharp$,
  }
}

const note = sources => (actions) => {
  return xs
    .combine(
      sources.props$,
      xs.merge(
        actions.clickTouch$.mapTo(false),
        actions.clickSharp$.mapTo(true),
      ),
    )
    .map(([props, clickSharp]) => ({
      note: `${props.note}${clickSharp ? '#' : ''}`,
      character: props.character,
      time: 4, // time in second
    }))
}

const view = state$ => (
  state$
    .map(props => li([
      div('.touch'),
      WITHOUT_SHARP.includes(props.note) ? '' : span('.sharp'),
    ]))
)

export default (sources) => {
  return {
    DOM$: view(sources.props$),
    NOTE$: note(sources)(intents(sources)),
  }
}
