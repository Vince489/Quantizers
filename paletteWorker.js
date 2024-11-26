self.onmessage = function(e) {
  const { imageData, palette } = e.data;
  const { width, height, data } = imageData;

  // Process each pixel
  const quantizedData = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Find the closest color in the palette
      const [closestR, closestG, closestB] = findClosestColor([r, g, b], palette);

      // Update pixel data
      quantizedData[i] = closestR;
      quantizedData[i + 1] = closestG;
      quantizedData[i + 2] = closestB;
      quantizedData[i + 3] = 255; // Alpha remains 255 (opaque)
  }

  // Send quantized image data back to the main thread
  const quantizedImageData = new ImageData(quantizedData, width, height);
  self.postMessage(quantizedImageData);
};

// Find the closest color in the palette using Euclidean distance
function findClosestColor(pixel, palette) {
  let minDistance = Infinity;
  let closestColor = null;

  for (const color of palette) {
      const distance = euclideanDistance(pixel, color);
      if (distance < minDistance) {
          minDistance = distance;
          closestColor = color;
      }
  }

  return closestColor;
}

// Calculate Euclidean distance between two colors
function euclideanDistance([r1, g1, b1], [r2, g2, b2]) {
  return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
  );
}
