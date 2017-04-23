import xs from 'xstream'
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'

export default (sink$) => {
  let listener
  let map
  let path
  let pathLength
  let duration

  const register = (board) => {
    console.debug('Registering map...')

    // FIXME : find a way to wait for first DOM$ event
    map = Snap(board.id)
    if (!map) {
      window.requestAnimationFrame(() => register(board))
      return
    }

    path = map.path(board.path).attr(board.attr)
    pathLength = Snap.path.getTotalLength(path)
    duration = board.duration
  }

  const animate = (follower) => {
    // FIXME : find a way to wait for first register event
    if (!map) {
      window.requestAnimationFrame(() => animate(follower))
      return
    }

    const svg = map.select(follower.id)
    const box = svg.getBBox()

    Snap.animate(
      0,
      pathLength,
      (step) => {
        const { x, y, alpha } = Snap.path.getPointAtLength(path, step)
        listener.next({ id: follower.id, done: false, step: step, point: { x, y, alpha } })

        svg.transform(`translate(${x}, ${y})`)
      },
      duration,
      mina.linear,
      () => {
        listener.next({ id: follower.id, done: true })
      },
    )
  }

  sink$.addListener({
    next: (animation) => {
      const { board, follower } = animation

      if (board) {
        register(board)
        return animation
      }

      if (follower) {
        animate(follower)
        return animation
      }
    }
  })

  return xs.create({
    start: (l) => { listener = l },
    stop: () => { listener = undefined },
  })
}
