"use client";

import { useEffect, useRef } from "react";
import { loadMediapipe } from "./mediapipe-loader";

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function init() {
      await loadMediapipe();

      if (!window.Hands || !window.Camera) return;

      const hands = new window.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 2
            });
            window.drawLandmarks(ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 1
            });
          }
        }

        ctx.restore();
      });

      const camera = new window.Camera(videoRef.current!, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });

      camera.start();
    }

    init();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}
