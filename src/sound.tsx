import * as Tone from "tone";

interface scaleNotesTypes {
  [key: string]: Array<string>;
}

export const modeOptions = ["Major", "Minor"];

export const scaleNotes: scaleNotesTypes = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  "C#": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  "D#": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "F"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  "G#": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  "A#": ["Bb", "C", "D", "Eb", "F", "G", "A"],
  B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
};

export const minorScaleNotes: scaleNotesTypes = {
  A: ["A", "B", "C", "D", "E", "F", "G"],
  "A#": ["A#", "C", "C#", "D#", "F", "F#", "G#"],
  B: ["B", "C#", "D", "E", "F#", "G", "A"],
  C: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  "C#": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  D: ["D", "E", "F", "G", "A", "Bb", "C"],
  "D#": ["D#", "F", "F#", "G#", "A#", "B", "C#"],
  E: ["E", "F#", "G", "A", "B", "C", "D"],
  F: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
  "F#": ["F#", "G#", "A", "B", "C#", "D", "E"],
  G: ["G", "A", "Bb", "C", "D", "Eb", "F"],
  "G#": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
};

const sortByKey = (rootNote: string, notes: Array<string>) => {
  let sortedNotes = notes.sort();
  let sortedByKeyNotes = sortedNotes;
  let pivotPoint = -1;
  for (let i = 0; i < sortedNotes.length; i++) {
    if (sortedNotes[i] <= rootNote) {
      pivotPoint = i;
    }
  }

  if (pivotPoint == 0) {
    let firstHalf = sortedNotes[0];
    let secondHalf = sortedNotes.slice(1);
    sortedByKeyNotes = secondHalf.concat(firstHalf);
  } else if (pivotPoint >= 0) {
    let firstHalf = sortedNotes.slice(0, pivotPoint);
    let secondHalf = sortedNotes.slice(pivotPoint);
    sortedByKeyNotes = secondHalf.concat(firstHalf);
  }

  return sortedByKeyNotes;
};

export const playNote = (
  synth: any,
  allNoteIndicies: Array<Array<number>>,
  playedNotesCallback: (noteNames: Array<string>, eventName: string) => void,
  eventName: string,
  activeKey: string,
  activeMode: string
) => {
  const now = Tone.now();

  let notes = new Array();
  let notesWithOctave = new Array();

  const selectedScale =
    activeMode === "Major" ? scaleNotes[activeKey] : minorScaleNotes[activeKey];

  const noteNames: Array<Array<string>> = [];
  allNoteIndicies.forEach((noteIndicies) => {
    let notes: Array<string> = [];
    noteIndicies.forEach((noteIndex) => {
      notes.push(selectedScale[noteIndex]);
    });
    noteNames.push(notes);
  });

  noteNames.forEach((noteOptions: Array<string>) => {
    let filtered = noteOptions.filter((item) => !notes.includes(item[0]));
    const randIdx = Math.floor(Math.random() * filtered.length);
    const noteName = filtered[randIdx];
    notes.push(noteName);
  });

  const sortedByKeyNotes = sortByKey(activeKey, notes);

  sortedByKeyNotes.forEach((note: string) => {
    const randOctave = Math.floor(Math.random() * 3 + 2);
    notesWithOctave.push(note + randOctave);
  });

  let delay = 0.0;
  notesWithOctave.forEach((note) => {
    synth.triggerAttackRelease(note, "16n", now + delay);
    delay += 0.05;
  });

  playedNotesCallback(notesWithOctave, eventName);
};
