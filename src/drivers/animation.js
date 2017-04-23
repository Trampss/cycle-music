import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'

export default (sink$) => {
  let map
  let path
  let pathLength

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
  }

  const animate = (follower) => {
    console.debug(`Animate ${follower.id}...`)

    if (!map) {
      window.requestAnimationFrame(() => animate(follower))
      return
    }

    setTimeout(() => {
      const svg = map.select(follower.id)
      const box = svg.getBBox()

      Snap.animate(
        0,
        pathLength,
        (step) => {
          const { x, y, alpha } = Snap.path.getPointAtLength(path, step)

          svg.transform(`translate(${x}, ${y}) rotate(${alpha - 90}, ${+box.cx}, ${+box.cy})`)
        },
        5000,
        mina.easeout,
        () => {
          console.log(`End for ${follower.id}`)
        },
      )
    }, follower.delay)
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
}
