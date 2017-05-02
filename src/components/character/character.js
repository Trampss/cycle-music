import { p } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

const className = '.character'

export default ({ NOTE$, props$ }) => {
  // Map the note
  let note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([note]) => Object.assign({}, note, { frequency: note.frequency + 1000 }))

  const music$ = note$

  // Print the DOM
  note$ = note$.startWith({ stop: true })

  // Add a 'stop' event
  const noteDelay$ = note$
    .map(note => xs.of(note).compose(delay(note.time)))
    .flatten()
    .map(note => Object.assign({}, note, { stop: true }))

  note$ = xs
    .merge(
      note$,
      noteDelay$,
    )

  const vdom$ = xs
    .combine(note$, props$)
    .map(([note, props]) => p(
      `${className} ${note.stop || '.notify'}`,
      { style: { color: note.stop ? 'black' : 'red' } },
      `${props.name} with ${props.instrument}`,
    ))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
