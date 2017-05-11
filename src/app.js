import World from './components/world'

export default ({ DOM$ }) => {
  /*
   Create World
   */
  const world = World({ DOM$ })


  return {
    DOM$: world.DOM$,
    MUSIC$: world.MUSIC$,
  }
}
