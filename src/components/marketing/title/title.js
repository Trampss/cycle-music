import xs from 'xstream'
import { a, div, img } from '@cycle/dom'

const view = () => xs.of(
  a('.title',
    { props: { href: 'https://github.com/alakarteio/cycle-music' } },
    [
      img('.github', { props: { src: '/github.png' } }),
      div('.text', 'cycle-music'),
    ],
))

export default () => {
  return {
    DOM$: view(),
  }
}
