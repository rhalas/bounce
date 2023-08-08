import * as Tone from "tone";

export const playNote = (synth: any, noteNames: Array<Array<string>>) => {
  const now = Tone.now();
  let delay = 0;
  noteNames.forEach((noteOptions: Array<string>) => {
    const randIdx = Math.floor(Math.random() * noteOptions.length);
    const noteName = noteOptions[randIdx];
    const randOctave = Math.floor(Math.random() * 3 + 2);
    synth.triggerAttackRelease(noteName + randOctave, "16n", now);
    delay += 0.1;
  });
};
