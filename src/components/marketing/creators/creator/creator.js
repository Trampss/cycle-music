import { div, a } from '@cycle/dom'

const view = ({ props$ }) => props$.map(
  ({ name, avatar, twitter }) => a(
    '.creator',
    { props: { href: `https://twitter.com/${twitter}` } },
    [
      div('.avatar', { style: { backgroundImage: `url('${avatar}')` } }),
      div('.name', name),
    ],
  ),
)

export default (sources) => {
  return {
    DOM$: view(sources),
  }
}
