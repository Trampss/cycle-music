import { div } from '@cycle/dom'
import xs from 'xstream'
import World from './components/world'
import Cyclejs from './components/cyclejs'
import Drivers from './components/drivers'

export default ({ DOM$ }) => {
  const world = World({ DOM$ })

  const cyclejs = Cyclejs({ MUSIC$: world.MUSIC$ })

  const drivers = Drivers({ MUSIC$: cyclejs.MUSIC$ })

  const vdom$ = xs.combine(
    world.DOM$,
    cyclejs.DOM$,
    drivers.DOM$,
  ).map(([worldDom, cyclejsDom, driversDom]) =>
    div('.app', [
      worldDom,
      div('.libraries', cyclejsDom),
      driversDom,
    ]))

  return {
    DOM$: vdom$,
    MUSIC$: drivers.MUSIC$,
  }
}
