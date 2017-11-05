import xs from 'xstream'
import { div } from '@cycle/dom'

const view = () => xs.of(
  div('.title', 'Cycle JS'),
)

export default () => {
  return {
    DOM: view(),
  }
}
