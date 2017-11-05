import xs from 'xstream'
import { div } from '@cycle/dom'
import Creator from './creator'

const model = ({ props$ }) => (
  props$
    .map(({ creators }) => (
      xs
        .combine(
          ...creators.map(
            creator => Creator({ props$: xs.of(creator) }).DOM,
          ),
        )
    ))
    .flatten()
)

const view = model$ => model$.map(
  children => div('.creators', children),
)

export default (sources) => {
  return {
    DOM: view(model(sources).debug('model')),
  }
}
