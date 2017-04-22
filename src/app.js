import { div } from '@cycle/dom'
import xs from 'xstream'

export function App() {
  const vtree$ = xs.of(
    div('My Awesome Cycle.js app'),
  )

  const music$ = xs.periodic(200).map(() => {
    return {
      frequency: (Math.random() * 1000) + 300,
      time: (Math.random() * 1000) + 200,
    }
  })

  const sinks = {
    DOM$: vtree$,
    MUSIC$: music$,
  }
  return sinks
}
