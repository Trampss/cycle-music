import { div } from '@cycle/dom'
import xs from 'xstream'
import World from './components/world'
import Cyclejs from './components/cyclejs'

export default ({ DOM$ }) => {
  /*
   Create World
   */
  const world = World({ DOM$ })

  const cyclejs = Cyclejs({ MUSIC$: world.MUSIC$ })

  const vdom$ = xs.combine(
    world.DOM$,
    cyclejs.DOM$,
  ).map(app => div('.app', app))

  return {
    DOM$: vdom$,
    MUSIC$: cyclejs.MUSIC$,
  }
}
