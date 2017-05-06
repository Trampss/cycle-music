import { div } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

const stopEvent = { stop: true }
const timeout = 1000

const addDelay = stream$ => stream$ && stream$.compose(delay(timeout))

export default ({ MUSIC$, NOTE$, HTTP$ }) => {
  const className = `.wire ${MUSIC$ ? '.music' : ''} ${NOTE$ ? '.note' : ''} ${HTTP$ ? '.http' : ''}`

  const start$ = xs.merge(
    MUSIC$ || xs.empty(),
    NOTE$ || xs.empty(),
    HTTP$ || xs.empty(),
  )

  // Add a 'stop' event after timeout
  const stop$ = start$.compose(delay(timeout))
    .map(() => stopEvent)

  const vdom$ = xs.merge(start$, stop$)
    .startWith(stopEvent)
    .map(s => div(`${className} ${s.stop && '.stop'}`))

  return {
    DOM$: vdom$,
    MUSIC$: addDelay(MUSIC$),
    NOTE$: addDelay(NOTE$),
    HTTP$: addDelay(HTTP$),
  }
}
