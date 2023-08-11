import * as Tone from "tone";
import { useState, useCallback, useEffect } from "react";
import { Canvas } from "./canvas";
import { NoteLog, NoteLogCollection } from "./noteLog";
import styled from "styled-components";

const AppComponent = styled.div`
  display: flex;
`;

function App() {
  const [initApp, setInitApp] = useState<boolean>(false);
  const [sineSynth, setSineSynth] = useState<Tone.PolySynth>();
  const [triangleSynth, setTriangleSynth] = useState<Tone.PolySynth>();

  useEffect(() => {
    const s1 = new Tone.PolySynth(Tone.Synth).toDestination();
    s1.set({
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

    const s2 = new Tone.PolySynth(Tone.Synth).toDestination();
    s2.set({
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

    const reverb = new Tone.Reverb({
      decay: 10.0,
      preDelay: 0.01,
    }).toDestination();
    s1.connect(reverb);
    s2.connect(reverb);

    setSineSynth(s1);
    setTriangleSynth(s2);
  }, []);

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
