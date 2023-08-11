import * as Tone from "tone";
import { useEffect, useState, useCallback } from "react";
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
      volume: -5,
    },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.5,
      release: 0.5,
    },
  });

  const sawtoothSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  sawtoothSynth.set({
    oscillator: {
      type: "sawtooth",
      volume: -5,
    },
    envelope: {
      attack: 0.2,
      decay: 0.4,
      sustain: 0.1,
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
              synths={[sineSynth, sawtoothSynth]}
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
