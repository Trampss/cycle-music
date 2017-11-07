import xs from 'xstream'
import { div } from '@cycle/dom'

const view = () => xs.of(
  div('.title', 'CycleJS, les mains dans le cambouis'),
)

export default () => {
  return {
    DOM: view(),
  }
}
