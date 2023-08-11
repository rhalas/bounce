import * as Tone from "tone";
import { useState, useCallback } from "react";
import { Canvas } from "./canvas";
import { NoteLog, NoteLogCollection } from "./noteLog";
import styled from "styled-components";

const AppComponent = styled.div`
  display: flex;
`;

function App() {
  const sineSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  sineSynth.set({
    oscillator: {
      type: "sine5",
      volume: -6,
    },
    envelope: {
      attack: 0.1,
      decay: 0.4,
      sustain: 0.3,
      release: 0.7,
    },
  });

  const triangleSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  triangleSynth.set({
    oscillator: {
      type: "triangle",
      volume: -6,
    },
    envelope: {
      attack: 0.1,
      decay: 0.4,
      sustain: 0.5,
      release: 0.3,
    },
  });

  const [initApp, setInitApp] = useState<boolean>(false);

  const [noteLog, setNoteLog] = useState<NoteLogCollection>({ entries: [] });

  const playedNotesCallback = useCallback(
    (noteNames: Array<string>, eventName: string) => {
      const newNoteLogEntry = { notes: noteNames, eventName: eventName };
      setNoteLog((prevNoteLog: NoteLogCollection) => ({
        ...prevNoteLog,
        entries: [...prevNoteLog.entries, newNoteLogEntry],
      }));
    },
    []
  );

  return (
    <>
      <AppComponent>
        {initApp ? (
          <>
            <Canvas
              synths={[sineSynth, triangleSynth]}
              playedNotesCallback={playedNotesCallback}
            />
            <NoteLog noteLog={noteLog} />
          </>
        ) : (
          <button onClick={() => setInitApp(true)}> Click to start </button>
        )}
      </AppComponent>
    </>
  );
}

export default App;
