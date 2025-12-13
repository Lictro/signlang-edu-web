"use client";

import { useEffect, useRef } from "react";
import { loadMediapipe } from "./mediapipe-loader";
import { HandKeypoints } from "@/src/utils/HandKeypoints";

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stores the previous frame vector for smoothing
  let previousVector: number[] = [];

  useEffect(() => {
    async function init() {
      // Load MediaPipe scripts from CDN
      await loadMediapipe();

      if (!window.Hands || !window.Camera) {
        console.error("MediaPipe not loaded");
        return;
      }

      // Initialize Hands model
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

      // Handle results on every frame
      hands.onResults((results: any) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw camera frame
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {
          results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
            // Draw landmarks and connections (visual feedback)
            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 2
            });

            window.drawLandmarks(ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 1
            });

            // Normalize hand keypoints
            const normalized = HandKeypoints.normalize(landmarks);

            // Smooth motion between frames
            previousVector = HandKeypoints.smooth(previousVector, normalized, 0.5);

            // Payload ready for backend
            const payload = {
              keypoints: previousVector,
              handIndex: index,
              handedness: results.multiHandedness?.[index]?.label ?? "Unknown",
              timestamp: Date.now()
            };

            console.log({payload})

            // Send data to backend (MVP version)
            // fetch("http://localhost:8000/gesture", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json"
            //   },
            //   body: JSON.stringify(payload)
            // }).catch((err) => console.error("API error:", err));
          });
        }

        ctx.restore();
      });

      // Initialize camera
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
      {/* Hidden video element used by MediaPipe */}
      <video ref={videoRef} className="hidden" />

      {/* Canvas used for drawing hand landmarks */}
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}
