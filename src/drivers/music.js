import Synth from 'trampss-audiosynth'

export default (sink$) => {
  sink$.addListener({
    next: (music) => {
      const { instrument, note, time } = music
      Synth.play(instrument, note, 3, time)
    },
  })
}
