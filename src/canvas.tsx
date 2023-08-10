import { useRef, useEffect } from "react";
import Matter from "matter-js";
import { playNote } from "./sound";
import styled from "styled-components";

type CanvasProps = {
  synth: any;
  playedNotesCallback: (noteNames: Array<string>, eventName: string) => void;
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

    Matter.Events.on(engine, "collisionStart", (event) => {
      var pairs = event.pairs;

      playNote(
        canvasProps.synth,
        [
          labelToNote[pairs[0].bodyA.label],
          labelToNote[pairs[0].bodyB.label],
          labelToNote["extraNote"],
        ],
        canvasProps.playedNotesCallback,
        `: ${pairs[0].bodyA.label} hit ${pairs[0].bodyB.label}`
      );
    });

    const ball = createBall("ball", "#58df20");
    const ball2 = createBall("ball2", "#a720df");
    const boundaries = createBoundaries();

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
  }, []);

  return (
    <MainCanvas ref={boxRef} style={{ width: 300, height: 300 }}>
      <canvas ref={canvasRef} />
    </MainCanvas>
  );
};
