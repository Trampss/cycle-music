import { img } from '@cycle/dom'

export default (sources) => {
  const { DOM$, name } = sources

  const actions$ = DOM$.select('.character').events('click')
  const model$ = actions$.mapTo(true).startWith(false)
  const vdom$ = model$.map(animate => (
    img(
      `.character${animate ? '.animate' : ''}`,
      { props: { src: `/svg/characters/${name}.svg` } },
    )
  ))

  const sinks = {
    DOM$: vdom$,
  }
  return sinks
}
