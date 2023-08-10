import * as Tone from "tone";

export const playNote = (synth: any, noteNames: Array<Array<string>>) => {
  const now = Tone.now();
  let notes = new Array();
  noteNames.forEach((noteOptions: Array<string>) => {
    const randIdx = Math.floor(Math.random() * noteOptions.length);
    const noteName = noteOptions[randIdx];
    const randOctave = Math.floor(Math.random() * 3 + 2);
    notes.push(noteName + randOctave);
  });
  synth.triggerAttackRelease(notes, "16n", now);
};
