"use client";

import { useEffect, useRef } from "react";

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load the required Mediapipe scripts
    const loadScripts = async () => {
      await Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"),
      ]);

      startCamera();
    };

    loadScripts();

    function startCamera() {
      if (!videoRef.current || !canvasRef.current) return;

      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext("2d");

      // @ts-ignore
      const hands = new window.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        modelComplexity: 1,
      });

      hands.onResults((results: any) => {
        ctx!.save();
        ctx!.clearRect(0, 0, canvasEl.width, canvasEl.height);

        ctx!.drawImage(
          results.image,
          0,
          0,
          canvasEl.width,
          canvasEl.height
        );

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            // @ts-ignore
            window.drawConnectors(
              ctx,
              landmarks,
              window.HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 2 }
            );
            // @ts-ignore
            window.drawLandmarks(
              ctx,
              landmarks,
              { color: "#FF0000", lineWidth: 1 }
            );
          }
        }

        ctx!.restore();
      });

      // @ts-ignore
      const camera = new window.Camera(videoEl, {
        onFrame: async () => {
          await hands.send({ image: videoEl });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }

    function loadScript(src: string) {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video className="hidden" ref={videoRef} />
      <canvas ref={canvasRef} width={640} height={480} className="rounded-xl shadow-lg" />
    </div>
  );
}
