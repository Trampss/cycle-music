import xs from 'xstream'
import { svg } from '@cycle/dom'
import Note from './note'

const id = '#campfire'

export default ({ DOM$, ANIMATION$ }) => {
  const notes = [
    Note({ DOM$, ANIMATION$, props$: xs.of({ id: '#note1', fill: 'red', r: '10px' }) }),
    Note({ DOM$, ANIMATION$, props$: xs.of({ id: '#note2', fill: 'green', r: '5px' }) }),
  ]

  const vdom$ = xs
    .combine(...notes.map(note => note.DOM$))
    .map(notesVdom => svg(
      id,
      { attrs: { x: '0px', y: '0px', width: '700px', height: '500px' } },
      notesVdom,
    ))

  const animation$ = xs.merge(
    xs.of({
      board: {
        id,
        duration: 2000,
        attr: { fill: 'none', stroke: 'black' },
        // eslint-disable-next-line no-multi-str
        path: ' \
          M 210.000 215.000 \
          L 280.711 280.711 \
          L 215.000 210.000 \
          L 280.711 139.289 \
          L 210.000 205.000 \
          L 139.289 139.289 \
          L 205.000 210.000 \
          L 139.289 280.711 \
          L 210.000 215.000 \
          z',
      },
    }),
    ...notes.map(note => note.ANIMATION$),
  )

  return {
    DOM$: vdom$,
    ANIMATION$: animation$,
  }
}
