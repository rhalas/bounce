import * as Tone from "tone";
import { useEffect, useState, useCallback } from "react";
import { Canvas } from "./canvas";
import { NoteLog, NoteLogCollection } from "./noteLog";
import styled from "styled-components";

const AppComponent = styled.div`
  display: flex;
`;

function App() {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const membraneSynth = new Tone.MembraneSynth().toDestination();
  const [initApp, setInitApp] = useState<boolean>(false);
  const [stopUpdating, setStopUpdating] = useState<boolean>(false);

  const [noteLog, setNoteLog] = useState<NoteLogCollection>({ entries: [] });

  const playedNotesCallback = useCallback(
    (noteNames: Array<string>, eventName: string) => {
      if (stopUpdating) {
        return;
      }

      const newNoteLogEntry = { notes: noteNames, eventName: eventName };
      setNoteLog((prevNoteLog: NoteLogCollection) => ({
        ...prevNoteLog,
        entries: [...prevNoteLog.entries, newNoteLogEntry],
      }));
    },
    [stopUpdating]
  );

  useEffect(() => {
    if (noteLog.entries.length > 5) {
      setStopUpdating(true);
    }
  }, [noteLog, stopUpdating]);

  return (
    <>
      <AppComponent>
        {initApp ? (
          <>
            <Canvas
              synth={synth}
              membraneSynth={membraneSynth}
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
