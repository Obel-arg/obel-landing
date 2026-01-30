/**
 * Simplex 2D Noise
 * Lightweight implementation for organic animation patterns
 */

// Permutation table for noise generation
const perm = new Uint8Array(512);
const gradP = new Float32Array(512 * 2);

// Gradient vectors for 2D
const grad2 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// Initialize with a seed
function seed(s: number) {
  if (s > 0 && s < 1) s *= 65536;
  s = Math.floor(s);
  if (s < 256) s |= s << 8;

  for (let i = 0; i < 256; i++) {
    let v: number;
    if (i & 1) {
      v = perm[i] ^ (s & 255);
    } else {
      v = perm[i] ^ ((s >> 8) & 255);
    }
    perm[i] = perm[i + 256] = v;
    const g = grad2[v % 8];
    gradP[i * 2] = gradP[(i + 256) * 2] = g[0];
    gradP[i * 2 + 1] = gradP[(i + 256) * 2 + 1] = g[1];
  }
}

// Initialize permutation table
for (let i = 0; i < 256; i++) {
  perm[i] = i;
}

// Shuffle using Fisher-Yates
for (let i = 255; i > 0; i--) {
  const j = Math.floor((i + 1) * Math.random());
  [perm[i], perm[j]] = [perm[j], perm[i]];
}

// Copy to second half
for (let i = 0; i < 256; i++) {
  perm[i + 256] = perm[i];
  const g = grad2[perm[i] % 8];
  gradP[i * 2] = gradP[(i + 256) * 2] = g[0];
  gradP[i * 2 + 1] = gradP[(i + 256) * 2 + 1] = g[1];
}

// Skewing factors for 2D simplex
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

/**
 * 2D Simplex Noise
 * Returns value between -1 and 1
 */
export function simplex2D(x: number, y: number): number {
  // Skew input space to determine which simplex cell we're in
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  // Unskew back to get the cell origin
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;

  // Distances from cell origin
  const x0 = x - X0;
  const y0 = y - Y0;

  // Determine which simplex we're in
  let i1: number, j1: number;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }

  // Offsets for middle and last corners
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  // Hash coordinates of the three simplex corners
  const ii = i & 255;
  const jj = j & 255;

  // Calculate contribution from three corners
  let n0 = 0,
    n1 = 0,
    n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj]] % 8;
    t0 *= t0;
    n0 = t0 * t0 * (gradP[gi0 * 2] * x0 + gradP[gi0 * 2 + 1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    t1 *= t1;
    n1 = t1 * t1 * (gradP[gi1 * 2] * x1 + gradP[gi1 * 2 + 1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
    t2 *= t2;
    n2 = t2 * t2 * (gradP[gi2 * 2] * x2 + gradP[gi2 * 2 + 1] * y2);
  }

  // Scale to [-1, 1]
  return 70 * (n0 + n1 + n2);
}

/**
 * Normalized 2D Simplex Noise
 * Returns value between 0 and 1
 */
export function simplex2DNormalized(x: number, y: number): number {
  return (simplex2D(x, y) + 1) * 0.5;
}

// Export seed function for reproducible patterns
export { seed as seedNoise };
