import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { App } from './app'
import { music, animation } from './drivers'

const main = App

const drivers = {
  DOM$: makeDOMDriver('#app'),
  MUSIC$: music,
  ANIMATION$: animation,
}

run(main, drivers)
