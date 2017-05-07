export default (sink$) => {
  sink$.addListener({
    next: (music) => {
      const { instrument, note, time } = music

      // eslint-disable-next-line no-undef
      Synth.play(instrument, note, 3, time)
    },
  })
}
