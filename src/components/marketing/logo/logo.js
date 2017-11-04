import xs from 'xstream'
import { a, img } from '@cycle/dom'

const view = () => xs.of(
  img('.logo', { props: { src: '/logo-bdxio.png' } }),
)

export default () => {
  return {
    DOM: view(),
  }
}
