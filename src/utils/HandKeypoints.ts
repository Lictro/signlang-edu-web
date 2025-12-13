
export type HandLandmark = {
  x: number;
  y: number;
  z: number;
};

export type HandVector = number[]; // 21 landmarks × 3 coordinates = 63 values

export class HandKeypoints {
  static normalize(landmarks: HandLandmark[]): HandVector {
    if (!landmarks || landmarks.length !== 21) return [];

    // Use wrist (index 0) as reference point
    const base = landmarks[0];

    const vector: HandVector = [];

    for (const lm of landmarks) {
      vector.push(lm.x - base.x); // relative X
      vector.push(lm.y - base.y); // relative Y
      vector.push(lm.z - base.z); // relative Z
    }

    return vector;
  }

  static smooth(
    previous: HandVector,
    current: HandVector,
    alpha = 0.5
  ): HandVector {
    if (!previous || previous.length !== current.length) return current;

    return current.map(
      (value, index) => alpha * value + (1 - alpha) * previous[index]
    );
  }

  static toPayload(landmarks: HandLandmark[]) {
    return {
      keypoints: this.normalize(landmarks),
      raw: landmarks,
      timestamp: Date.now()
    };
  }
}
