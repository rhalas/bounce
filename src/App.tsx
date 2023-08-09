import * as Tone from "tone";
import { useState } from "react";
import { Canvas } from "./canvas";
import styled from "styled-components";

function App() {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const [initApp, setInitApp] = useState<boolean>(false);

  const AppDiv = styled.div`
    display: flex;
    margin: auto;
  `;

  return (
    <>
      <AppDiv>
        {initApp ? (
          <Canvas synth={synth} />
        ) : (
          <button onClick={() => setInitApp(true)}> Click to start </button>
        )}
      </AppDiv>
    </>
  );
}

export default App;
