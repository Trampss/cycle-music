import { div, img } from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import Wire from '../wire'

export default ({ NOTE$, props$ }) => {
  // Map the note
  let note$ = xs
    .combine(NOTE$, props$)
    .filter(([note, props]) => note.instrument === props.instrument)
    .map(([note]) => Object.assign({}, note, { frequency: note.frequency + 1000 }))

  const wire = Wire({
    STREAM$: note$,
    props$: props$.map(p => Object.assign({
      radius: 45,
      color: 'black',
      colorAnimate: 'red',
      length: 100,
      startPosition: { x: 50, y: 10 },
    }, p.wire)),
  })

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
