import { div } from '@cycle/dom'
import xs from 'xstream'
import { CREATORS } from './constants'
import World from './components/world'
import Cyclejs from './components/cyclejs'
import Drivers from './components/drivers'
import Logo from './components/marketing/logo'
import Title from './components/marketing/title'
import Creators from './components/marketing/creators'

const view = world => cyclejs => (drivers) => {
  const logo = Logo()
  const title = Title()
  const creators = Creators({ props$: xs.of({ creators: CREATORS }) })

  return xs
    .combine(
      world.DOM,
      cyclejs.DOM.map(children => div('.libraries', children)),
      drivers.DOM,
      logo.DOM,
      title.DOM,
      creators.DOM,
    )
    .map(children => div('.app', children))
}

export default ({ DOM }) => {
  const world = World({ DOM })
  const cyclejs = Cyclejs({ MUSIC: world.MUSIC })
  const drivers = Drivers({ MUSIC: cyclejs.MUSIC })

  return {
    DOM: view(world)(cyclejs)(drivers),
    MUSIC: drivers.MUSIC,
  }
}
