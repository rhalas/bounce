import { useRef, useEffect, useState, useCallback } from "react";
import Matter from "matter-js";
import { playNote } from "./sound";
import styled from "styled-components";

type CanvasProps = {
  synths: Array<any>;
  playedNotesCallback: (noteNames: Array<string>, eventName: string) => void;
};

type NoteEvent = {
  name: string;
  labelA: string;
  labelB: string;
};

const MainCanvas = styled.div`
  display: flex;
  margin: auto;
`;

export const Canvas = (canvasProps: CanvasProps) => {
  interface labelToNoteType {
    [key: string]: Array<string>;
  }

  interface boundaryType {
    floor: Matter.Body;
    ceiling: Matter.Body;
    leftWall: Matter.Body;
    rightWall: Matter.Body;
  }

  const labelToNote: labelToNoteType = {
    floor: ["B", "D", "F"],
    ceiling: ["B", "D", "F"],
    leftWall: ["B", "D", "F"],
    rightWall: ["B", "D", "F"],
    ball: ["A", "B", "C"],
    ball2: ["D", "E", "F"],
    extraNote: ["A", "C", "E", "G"],
  };

  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [initDone, setInitDone] = useState<boolean>();
  const [signalsDone, setSignalsDone] = useState<boolean>();
  const [lastEvent, setLastEvent] = useState<NoteEvent>({
    name: "",
    labelA: "",
    labelB: "",
  });
  const [newEvent, setNewEvent] = useState<NoteEvent>({
    name: "",
    labelA: "",
    labelB: "",
  });
  const [engineState, setEngineState] = useState<Matter.Engine>();

  const createBall = (labelName: string, color: string) => {
    return Matter.Bodies.circle(
      Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 300),
      10,
      {
        restitution: 1.5,
        render: {
          fillStyle: color,
        },
        label: labelName,
      }
    );
  };

  const createBoundaries = (): boundaryType => {
    const floor = Matter.Bodies.rectangle(150, 300, 300, 20, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "floor",
    });

    const ceiling = Matter.Bodies.rectangle(20, 5, 600, 20, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "ceiling",
    });

    const leftWall = Matter.Bodies.rectangle(0, 0, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "leftWall",
    });

    const rightWall = Matter.Bodies.rectangle(300, 300, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "rightWall",
    });

    return { floor, ceiling, leftWall, rightWall };
  };

  useEffect(() => {
    if (newEvent.name !== lastEvent.name) {
      playNote(
        canvasProps.synths[
          Math.floor(Math.random() * canvasProps.synths.length)
        ],
        [
          labelToNote[newEvent!.labelA],
          labelToNote[newEvent!.labelB],
          labelToNote["extraNote"],
        ],
        canvasProps.playedNotesCallback,
        newEvent!.name
      );

      setLastEvent(newEvent);
    } else {
      console.log("AAA");
    }
  }, [newEvent]);

  const collisionCallback = useCallback(
    (pairs: any) => {
      var eventName = `: ${pairs[0].bodyA.label} hit ${pairs[0].bodyB.label}`;
      setNewEvent({
        name: eventName,
        labelA: pairs[0].bodyA.label,
        labelB: pairs[0].bodyB.label,
      });
    },
    [setLastEvent, lastEvent]
  );

  useEffect(() => {
    if (initDone && !signalsDone) {
      Matter.Events.on(engineState, "collisionStart", (event) => {
        collisionCallback(event.pairs);
      });
      setSignalsDone(true);
    }
  }, [
    engineState,
    initDone,
    lastEvent,
    setLastEvent,
    signalsDone,
    setSignalsDone,
  ]);

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current!,
      engine: engine,
      canvas: canvasRef.current!,
      options: {
        width: 300,
        height: 300,
        background: "#df4820",
        wireframes: false,
      },
    });

    engine.gravity.y = 0.5;

    const ball = createBall("ball", "#58df20");
    const ball2 = createBall("ball2", "#a720df");
    const boundaries = createBoundaries();

    setEngineState(engine);

    World.add(engine.world, [
      boundaries.floor,
      boundaries.leftWall,
      boundaries.ceiling,
      boundaries.rightWall,
      ball,
      ball2,
    ]);

    Matter.Runner.run(engine!);
    Matter.Render.run(render!);
    setInitDone(true);
  }, []);

  return (
    <MainCanvas ref={boxRef} style={{ width: 300, height: 300 }}>
      <canvas ref={canvasRef} />
    </MainCanvas>
  );
};
