/**
 * FluidField - Fluid dynamics simulation using Jos Stam's Stable Fluids algorithm
 * Ported from pixel-dust by @neave (MIT License)
 *
 * This implementation uses Float32Array for better performance.
 */

export interface FluidConfig {
  iterations: number;
  dt: number;
  damp: number;
}

export interface FieldAccessor {
  getDensity(x: number, y: number): number;
  setDensity(x: number, y: number, d: number): void;
  setVelocity(x: number, y: number, xv: number, yv: number): void;
}

const DEFAULT_CONFIG: FluidConfig = {
  iterations: 4,
  dt: 0.05,
  damp: 0.85, // Lower = faster fade (was 0.99, now particles disappear quickly)
};

export class FluidField {
  private config: FluidConfig;
  private width = 0;
  private height = 0;
  private rowSize = 0;
  private size = 0;

  private dens: Float32Array | null = null;
  private dens_prev: Float32Array | null = null;
  private u: Float32Array | null = null;
  private u_prev: Float32Array | null = null;
  private v: Float32Array | null = null;
  private v_prev: Float32Array | null = null;

  constructor(config: Partial<FluidConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private createField(dens: Float32Array, u: Float32Array, v: Float32Array): FieldAccessor {
    const rowSize = this.rowSize;
    return {
      getDensity: (x: number, y: number): number => {
        return dens[(x + 1) + (y + 1) * rowSize];
      },
      setDensity: (x: number, y: number, d: number): void => {
        dens[(x + 1) + (y + 1) * rowSize] = d;
      },
      setVelocity: (x: number, y: number, xv: number, yv: number): void => {
        u[(x + 1) + (y + 1) * rowSize] = xv;
        v[(x + 1) + (y + 1) * rowSize] = yv;
      },
    };
  }

  private addFields(x: Float32Array, s: Float32Array): void {
    const dt = this.config.dt;
    for (let i = this.size; i--; ) {
      x[i] += s[i] * dt;
    }
  }

  private setBoundary(b: number, x: Float32Array): void {
    const width = this.width;
    const height = this.height;
    const rowSize = this.rowSize;

    if (b === 1) {
      for (let i = 1; i <= width; i++) {
        x[i] = x[i + rowSize];
        x[i + (height + 1) * rowSize] = x[i + height * rowSize];
      }
      for (let j = 1; j <= height; j++) {
        x[j * rowSize] = -x[1 + j * rowSize];
        x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
      }
    } else if (b === 2) {
      for (let i = 1; i <= width; i++) {
        x[i] = -x[i + rowSize];
        x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
      }
      for (let j = 1; j <= height; j++) {
        x[j * rowSize] = x[1 + j * rowSize];
        x[(width + 1) + j * rowSize] = x[width + j * rowSize];
      }
    } else {
      for (let i = 1; i <= width; i++) {
        x[i] = x[i + rowSize];
        x[i + (height + 1) * rowSize] = x[i + height * rowSize];
      }
      for (let j = 1; j <= height; j++) {
        x[j * rowSize] = x[1 + j * rowSize];
        x[(width + 1) + j * rowSize] = x[width + j * rowSize];
      }
    }

    const maxEdge = (height + 1) * rowSize;
    x[0] = 0.5 * (x[1] + x[rowSize]);
    x[maxEdge] = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
    x[width + 1] = 0.5 * (x[width] + x[(width + 1) + rowSize]);
    x[(width + 1) + maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
  }

  private solveLinear(b: number, x: Float32Array, x0: Float32Array, a: number, c: number): void {
    const { iterations } = this.config;
    const width = this.width;
    const height = this.height;
    const rowSize = this.rowSize;

    if (a === 0 && c === 1) {
      for (let j = 1; j <= height; j++) {
        let currentRow = j * rowSize + 1;
        for (let i = 0; i < width; i++) {
          x[currentRow] = x0[currentRow];
          currentRow++;
        }
      }
      this.setBoundary(b, x);
    } else {
      const invC = 1 / c;
      for (let k = 0; k < iterations; k++) {
        for (let j = 1; j <= height; j++) {
          let lastRow = (j - 1) * rowSize;
          let currentRow = j * rowSize;
          let nextRow = (j + 1) * rowSize;
          let lastX = x[currentRow];
          currentRow++;

          for (let i = 1; i <= width; i++) {
            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
          }
        }
        this.setBoundary(b, x);
      }
    }
  }

  private solveLinear2(
    x: Float32Array,
    x0: Float32Array,
    y: Float32Array,
    y0: Float32Array,
    a: number,
    c: number
  ): void {
    const { iterations } = this.config;
    const width = this.width;
    const height = this.height;
    const rowSize = this.rowSize;

    if (a === 0 && c === 1) {
      for (let j = 1; j <= height; j++) {
        let currentRow = j * rowSize + 1;
        for (let i = 0; i < width; i++) {
          x[currentRow] = x0[currentRow];
          y[currentRow] = y0[currentRow];
          currentRow++;
        }
      }
      this.setBoundary(1, x);
      this.setBoundary(2, y);
    } else {
      const invC = 1 / c;
      for (let k = 0; k < iterations; k++) {
        for (let j = 1; j <= height; j++) {
          let lastRow = (j - 1) * rowSize;
          let currentRow = j * rowSize;
          let nextRow = (j + 1) * rowSize;
          let lastX = x[currentRow];
          let lastY = y[currentRow];
          currentRow++;

          for (let i = 1; i <= width; i++) {
            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
            lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
          }
        }
        this.setBoundary(1, x);
        this.setBoundary(2, y);
      }
    }
  }

  private diffuse(b: number, x: Float32Array, x0: Float32Array): void {
    const a = 0;
    this.solveLinear(b, x, x0, a, 1 + 4 * a);
  }

  private diffuse2(x: Float32Array, x0: Float32Array, y: Float32Array, y0: Float32Array): void {
    const a = 0;
    this.solveLinear2(x, x0, y, y0, a, 4 * a + 1);
  }

  private advect(b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array): void {
    const { dt } = this.config;
    const width = this.width;
    const height = this.height;
    const rowSize = this.rowSize;

    const wdt0 = width * dt;
    const hdt0 = height * dt;
    const wp5 = width + 0.5;
    const hp5 = height + 0.5;

    for (let j = 1; j <= height; j++) {
      let pos = j * rowSize;
      for (let i = 1; i <= width; i++) {
        let x = i - wdt0 * u[++pos];
        let y = j - hdt0 * v[pos];

        if (x < 0.5) x = 0.5;
        else if (x > wp5) x = wp5;

        const i0 = x | 0;
        const i1 = i0 + 1;

        if (y < 0.5) y = 0.5;
        else if (y > hp5) y = hp5;

        const j0 = y | 0;
        const j1 = j0 + 1;
        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;
        const row1 = j0 * rowSize;
        const row2 = j1 * rowSize;

        d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
      }
    }

    this.setBoundary(b, d);
  }

  private project(u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array): void {
    const width = this.width;
    const height = this.height;
    const rowSize = this.rowSize;

    const h = -0.5 / Math.sqrt(width * height);

    for (let j = 1; j <= height; j++) {
      const row = j * rowSize;
      let prevRow = (j - 1) * rowSize;
      let prevValue = row - 1;
      let currentRow = row;
      let nextValue = row + 1;
      let nextRow = (j + 1) * rowSize;

      for (let i = 1; i <= width; i++) {
        div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++prevRow]);
        p[currentRow] = 0;
      }
    }

    this.setBoundary(0, div);
    this.setBoundary(0, p);
    this.solveLinear(0, p, div, 1, 4);

    const wScale = 0.5 * width;
    const hScale = 0.5 * height;

    for (let j = 1; j <= height; j++) {
      let prevPos = j * rowSize - 1;
      let currentPos = j * rowSize;
      let nextPos = j * rowSize + 1;
      let prevRow = (j - 1) * rowSize;
      let nextRow = (j + 1) * rowSize;

      for (let i = 1; i <= width; i++) {
        u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
        v[currentPos] -= hScale * (p[++nextRow] - p[++prevRow]);
      }
    }

    this.setBoundary(1, u);
    this.setBoundary(2, v);
  }

  private densityStep(x: Float32Array, x0: Float32Array, u: Float32Array, v: Float32Array): void {
    this.addFields(x, x0);
    this.diffuse(0, x0, x);
    this.advect(0, x, x0, u, v);
  }

  private velocityStep(u: Float32Array, v: Float32Array, u0: Float32Array, v0: Float32Array): void {
    this.addFields(u, u0);
    this.addFields(v, v0);

    let temp = u0;
    u0 = u;
    u = temp;

    temp = v0;
    v0 = v;
    v = temp;

    this.diffuse2(u, u0, v, v0);
    this.project(u, v, u0, v0);

    temp = u0;
    u0 = u;
    u = temp;

    temp = v0;
    v0 = v;
    v = temp;

    this.advect(1, u, u0, u0, v0);
    this.advect(2, v, v0, u0, v0);
    this.project(u, v, u0, v0);
  }

  /**
   * Run one simulation step
   * @param updateCallback Called with field accessor to set input (velocity, density)
   * @param drawCallback Called with field accessor to read output (density)
   */
  update(
    updateCallback: (field: FieldAccessor) => void,
    drawCallback: (field: FieldAccessor) => void
  ): void {
    if (!this.dens || !this.dens_prev || !this.u || !this.u_prev || !this.v || !this.v_prev) {
      return;
    }

    const { damp } = this.config;

    // Clear previous frame inputs and apply damping
    for (let i = this.size; i--; ) {
      this.u_prev[i] = 0;
      this.v_prev[i] = 0;
      this.dens_prev[i] = 0;
      this.dens[i] *= damp;
    }

    // Get input from callback
    updateCallback(this.createField(this.dens_prev, this.u_prev, this.v_prev));

    // Run simulation steps
    this.velocityStep(this.u, this.v, this.u_prev, this.v_prev);
    this.densityStep(this.dens, this.dens_prev, this.u, this.v);

    // Output to draw callback
    drawCallback(this.createField(this.dens, this.u, this.v));
  }

  /**
   * Set the resolution of the fluid field
   */
  setResolution(w: number, h: number): void {
    this.width = w;
    this.height = h;
    this.reset();
  }

  /**
   * Reset all field data
   */
  reset(): void {
    this.rowSize = this.width + 2;
    this.size = (this.width + 2) * (this.height + 2);

    this.dens = new Float32Array(this.size);
    this.dens_prev = new Float32Array(this.size);
    this.u = new Float32Array(this.size);
    this.u_prev = new Float32Array(this.size);
    this.v = new Float32Array(this.size);
    this.v_prev = new Float32Array(this.size);
  }

  /**
   * Get field dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Dispose of all allocated memory
   */
  dispose(): void {
    this.dens = null;
    this.dens_prev = null;
    this.u = null;
    this.u_prev = null;
    this.v = null;
    this.v_prev = null;
  }
}
