import { div, li, span } from '@cycle/dom'
import xs from 'xstream'
import { WITHOUT_SHARP } from '../../../../constants'

const className = '.touch'

export default ({ DOM$, props$ }) => {
  const clickTouch$ = DOM$
    .select(className)
    .events('click')
    .map(() => ({ withSharp: false }))

  const clickSharp$ = DOM$
    .select('.sharp')
    .events('click')
    .map(() => ({ withSharp: true }))

  const action$ = xs.merge(clickTouch$, clickSharp$)

  const note$ = xs
    .combine(props$, action$)
    .map(([props, click]) => ({
      note: `${props.note}${click.withSharp ? '#' : ''}`,
      character: props.character,
      time: 4, // time in second
    }))

  const vdom$ = props$
    .map(props => li([
      div('.touch'),
      WITHOUT_SHARP.includes(props.note) ? '' : span('.sharp'),
    ]))

  return {
    DOM$: vdom$,
    NOTE$: note$,
  }
}
