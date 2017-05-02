import { div, img } from '@cycle/dom'
import xs from 'xstream'
import Wire from '../wire'
import delay from 'xstream/extra/delay'

export default ({ NOTE$, props$ }) => {
  // Map the note
  let note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([note]) => Object.assign({}, note, { frequency: note.frequency + 1000 }))

  const wire = Wire({ STREAM$: note$, props$: xs.of({ name: 'WIRE MAN' }) })

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
      wire.DOM$,
    )
    .map(([note, props, wireDom]) =>
      div(
        img(
          `.character${note.stop ? '' : '.animate'}`,
          { props: { src: `/svg/${props.name}.svg` } },
        ),
        wire,
      ),
    )

  return {
    DOM$: vdom$,
    MUSIC$: wire.STREAM$,
  }
}
