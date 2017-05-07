import { div } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

/**
 *
 * @param MUSIC$ Stream of music
 * @param NOTE$ Stream of note
 * @param HTTP$ Stream of http
 * @returns {{STREAM$: *}}
 */
export default ({ MUSIC$, NOTE$, HTTP$ }) => {
  const className = `.wire ${MUSIC$ ? '.music' : ''} ${NOTE$ ? '.note' : ''} ${HTTP$ ? '.http' : ''}`
  const addStop = (a, o) => Object.assign({}, o, { stop: a })
  const tempo = 1000

  const start$ = xs.merge(
    MUSIC$ || xs.empty(),
    NOTE$ || xs.empty(),
    HTTP$ || xs.empty(),
  ).map(s => addStop(false, s)) // FIXME: the dataflow shouldn't transfert the data stop

  // Add a 'stop' event after tempo
  const stop$ = start$.compose(delay(tempo))
    .map(s => addStop(true, s))

  const stream$ = xs.merge(start$, stop$)
    .filter(s => s.stop)

  const vdom$ = xs.merge(start$, stop$)
    .startWith(addStop(true))
    .map(s => div(`${className} ${s.stop && '.stop'}`))

  return {
    DOM$: vdom$,
    STREAM$: stream$,
  }
}
