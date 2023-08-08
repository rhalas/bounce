import * as Tone from "tone";
import { useState } from "react";
import { Canvas } from "./canvas";

function App() {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const [initApp, setInitApp] = useState<boolean>(false);

  return (
    <>
      <div>
        {initApp ? (
          <Canvas synth={synth} />
        ) : (
          <button onClick={() => setInitApp(true)}> Click to start </button>
        )}
      </div>
    </>
  );
}

export default App;
