import { useRef, useEffect } from "react";
import Matter from "matter-js";
import { playNote } from "./sound";

type CanvasProps = {
  synth: any;
};

export const Canvas = (canvasProps: CanvasProps) => {
  interface labelToNoteType {
    [key: string]: Array<string>;
  }

  const labelToNote: labelToNoteType = {
    boundary: ["A", "B", "C", "D"],
    ball: ["E", "F", "G"],
  };

  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;

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
      playNote(canvasProps.synth, [
        labelToNote[pairs[0].bodyA.label as string],
        labelToNote[pairs[0].bodyB.label],
      ]);
    });

    const floor = Bodies.rectangle(150, 300, 300, 20, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "boundary",
    });

    const ceiling = Bodies.rectangle(20, 5, 600, 20, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "boundary",
    });

    const leftWall = Bodies.rectangle(0, 0, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "boundary",
    });

    const rightWall = Bodies.rectangle(300, 300, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: "#20b7df",
      },
      label: "boundary",
    });

    const ball = Bodies.circle(150, 10, 10, {
      restitution: 1.5,
      render: {
        fillStyle: "#58df20",
      },
      label: "ball",
    });

    const ball3 = Bodies.circle(150, 25, 10, {
      restitution: 1.5,
      render: {
        fillStyle: "#a720df",
      },
      label: "ball",
    });

    World.add(engine.world, [floor, leftWall, ceiling, rightWall, ball, ball3]);

    Matter.Runner.run(engine!);
    Matter.Render.run(render!);
  }, []);

  return (
    <div ref={boxRef} style={{ width: 300, height: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
