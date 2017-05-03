import { div, img } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import Wire from '../wire'

export default ({ NOTE$, props$ }) => {
  const tempo = 1000
  // Map the note
  let note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([note]) => Object.assign({}, note, { frequency: note.frequency + 1000 }))

  const wire = Wire({
    STREAM$: note$,
    props$: xs.of({
      animateClass: '.animate',
      className: '.wire',
    }),
  })

  // Add a 'stop' event (for animation)
  const noteStart$ = note$
  const noteStop$ = note$
    .map(note => xs.of(note).compose(delay(tempo)))
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
      div(`.${props.name}`,
        [
          img(
            `.character ${note.stop ? '' : '.animate'}`,
            { props: { src: `/svg/${props.name}.svg` } },
          ),
          wireDom,
        ],
      ),
    )

  return {
    DOM$: vdom$,
    MUSIC$: wire.STREAM$,
  }
}
