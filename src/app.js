import { div } from '@cycle/dom'
import xs from 'xstream'
import World from './components/world'
import Cyclejs from './components/cyclejs'
import Drivers from './components/drivers'

const view = world => cyclejs => drivers => (
  xs
    .combine(
      world.DOM$,
      cyclejs.DOM$.map(children => div('.libraries', children)),
      drivers.DOM$,
    )
    .map(children => div('.app', children))
  )

export default ({ DOM$ }) => {
  const world = World({ DOM$ })
  const cyclejs = Cyclejs({ MUSIC$: world.MUSIC$ })
  const drivers = Drivers({ MUSIC$: cyclejs.MUSIC$ })

  return {
    DOM$: view(world)(cyclejs)(drivers),
    MUSIC$: drivers.MUSIC$,
  }
}
