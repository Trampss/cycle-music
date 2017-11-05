import xs from 'xstream'
import { img } from '@cycle/dom'

const view = () => xs.of(
  img('.logo', { props: { src: '/logo.png' } }),
)

export default () => {
  return {
    DOM: view(),
  }
}
