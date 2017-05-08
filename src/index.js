import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import World from './components/world'
import { music } from './drivers'

const main = World

const drivers = {
  DOM$: makeDOMDriver('#world'),
  MUSIC$: music,
}

run(main, drivers)
