import Rythmbox from './components/rythmbox'

export function App({ DOM$ }) {
  const rythmbox = Rythmbox({ DOM$ })

  const vdom$ = rythmbox.DOM$
  const music$ = rythmbox.MUSIC$

  const sinks = {
    DOM$: vdom$,
    MUSIC$: music$,
  }

  return sinks
}
