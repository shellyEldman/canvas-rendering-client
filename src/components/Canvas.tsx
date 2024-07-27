import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

interface Rect {
  Width: number;
  Height: number;
  X: number;
  Y: number;
  ts: number;
}

interface Point {
  X: number;
  Y: number;
  ts: number;
}

const canvasWidth = 800;
const canvasHeight = 600;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = useState<Rect>();
  const [point, setPoint] = useState<Point>();

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("rect", (data: Rect) => {
      setRect(data);
    });

    socket.on("point", (data: Point) => {
      setPoint(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // console.time("Canvas Drawing Time");

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context && rect && point) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const rectX = rect.X * canvasWidth;
      const rectY = rect.Y * canvasHeight;
      const rectWidth = rect.Width * canvasWidth;
      const rectHeight = rect.Height * canvasHeight;

      const pointX = point.X * canvasWidth;
      const pointY = point.Y * canvasHeight;

      const isPointInsideRect =
        pointX >= rectX &&
        pointX <= rectX + rectWidth &&
        pointY >= rectY &&
        pointY <= rectY + rectHeight;

      context.fillStyle = isPointInsideRect ? "green" : "red";
      context.fillRect(rectX, rectY, rectWidth, rectHeight);

      context.fillStyle = "black";
      context.fillText(`Rect TS: ${rect.ts}`, rectX, rectY - 10);
      context.fillText(`Point TS: ${point.ts}`, pointX, pointY - 10);

      context.beginPath();
      context.arc(pointX, pointY, 5, 0, Math.PI * 2, true);
      context.fillStyle = "blue";
      context.fill();
    }

    // console.timeEnd("Canvas Drawing Time");
  }, [rect, point]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default Canvas;
