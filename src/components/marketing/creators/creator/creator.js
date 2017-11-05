import { div, a } from '@cycle/dom'

const view = ({ props$ }) => props$.map(
  ({ name, avatar, link }) => a(
    '.creator',
    { props: { href: link } },
    [
      div('.avatar', { style: { backgroundImage: `url('${avatar}')` } }),
      div('.name', name),
    ],
  ),
)

export default (sources) => {
  return {
    DOM: view(sources),
  }
}
