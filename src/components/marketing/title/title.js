import xs from 'xstream'
import { div } from '@cycle/dom'

const view = () => xs.of(
  div('.title', 'God bless CycleJS!'),
)

export default () => {
  return {
    DOM$: view(),
  }
}
