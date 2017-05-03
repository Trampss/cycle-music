import { img } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

export default ({ NOTE$, props$ }) => {
  // Map the note
  let note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([note]) => Object.assign({}, note, { frequency: note.frequency + 1000 }))

  const music$ = note$

  // Add a 'stop' event (for animation)
  const noteStart$ = note$
  const noteStop$ = note$
    .map(note => xs.of(note).compose(delay(200)))
    .flatten()
    .map(note => Object.assign({}, note, { stop: true }))
  note$ = xs.merge(noteStart$, noteStop$)

  const vdom$ = xs
    .combine(
      note$.startWith({ stop: true }), // startWith to print the DOM the first time
      props$,
    )
    .map(([note, props]) => img(
      `.character${note.stop ? '' : '.animate'}`,
      { props: { src: `/svg/${props.name}.svg` } },
    ))

  return {
    DOM$: vdom$,
    MUSIC$: music$,
  }
}
