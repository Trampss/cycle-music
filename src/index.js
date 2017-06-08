import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import isolate from '@cycle/isolate'
import list from './list'
import Character from './character'

const CHARACTER_NAMES = ['zora', 'goron']

const main = (sources) => {
  const characters = CHARACTER_NAMES.map(name => isolate(Character, name)({ ...sources, name }))

  const sinks = {
    ...list(characters)(sources),
  }
  return sinks
}

const drivers = {
  DOM$: makeDOMDriver('#app'),
}

run(main, drivers)
