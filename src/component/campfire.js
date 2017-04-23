import xs from 'xstream'
import { svg } from '@cycle/dom'
import Note from './note'

const id = '#campfire'

export default ({ DOM$ }) => {
  const notes = [
    Note({ DOM$, props$: xs.of({ id: '#note1', fill: 'red', r: '10px' }) }),
    Note({ DOM$, props$: xs.of({ id: '#note2', fill: 'green', r: '5px', delay: 1000 }) }),
  ]

  const vdom$ = xs
    .combine(...notes.map(note => note.DOM$))
    .map(notes => svg(
      id,
      { attrs: { x: '0px', y: '0px', width: '700px', height: '500px' } },
      notes,
    ))

  const animation$ = xs.merge(
    xs.of({
      board: {
        id,
        attr: { fill: 'none', stroke: 'black' },
        path: 'M339.233,312.53c-37.779,16.943-119.567-21.598-134.165-71.924c-19.086-65.802,19.072-124.856,64.665-145.753s157.388-22.525,219.128,74.23s-20.242,229.959-114.73,240.688   c-88.678,10.069-230.255-62.044-230.25-163.305'
      }
    }),
    ...notes.map(note => note.ANIMATION$),
  )

  return {
    DOM$: vdom$,
    ANIMATION$: animation$,
  }
}
