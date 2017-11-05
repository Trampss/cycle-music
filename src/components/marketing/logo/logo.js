import xs from 'xstream'
import { img } from '@cycle/dom'

const view = () => xs.of(
  img('.logo', { props: { src: '/logo-web2day.png' } }),
)

export default () => {
  return {
    DOM: view(),
  }
}
