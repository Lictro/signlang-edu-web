export async function loadMediapipe() {
  if (typeof window === "undefined") return;

  if (window.Hands && window.Camera) return;

  const scripts = [
    "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
    "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
    "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  ];

  for (const src of scripts) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
}
