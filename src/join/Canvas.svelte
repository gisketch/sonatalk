<script lang="ts">
  import { onMount } from 'svelte'

  /** Logical raster size — also the PNG export size (kept small for ≤200KB uploads). */
  const SIZE = 512
  const PAPER = '#FAF9F5'

  let {
    color = '#262624',
    brush = 6,
    mode = 'draw',
    locked = false,
  }: { color?: string; brush?: number; mode?: 'draw' | 'fill'; locked?: boolean } = $props()

  let canvasEl: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let drawing = false
  let undoState: ImageData | null = null

  onMount(() => {
    ctx = canvasEl.getContext('2d', { willReadFrequently: true })!
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, SIZE, SIZE)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  })

  function point(e: PointerEvent) {
    const rect = canvasEl.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    }
  }

  function down(e: PointerEvent) {
    if (locked) return
    if (mode === 'fill') {
      fillAt(e.clientX, e.clientY, color)
      return
    }
    canvasEl.setPointerCapture(e.pointerId)
    undoState = ctx.getImageData(0, 0, SIZE, SIZE)
    drawing = true
    const { x, y } = point(e)
    ctx.strokeStyle = color
    ctx.lineWidth = brush
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.01, y + 0.01) // dot on tap
    ctx.stroke()
  }

  function move(e: PointerEvent) {
    if (!drawing || locked) return
    const { x, y } = point(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function up() {
    drawing = false
  }

  export function undo() {
    if (undoState) {
      ctx.putImageData(undoState, 0, 0)
      undoState = null
    }
  }

  export function clear() {
    undoState = ctx.getImageData(0, 0, SIZE, SIZE)
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, SIZE, SIZE)
  }

  /** Flood fill from a tap point (tools tier). Saves undo state first. */
  export function fillAt(clientX: number, clientY: number, fillColor: string) {
    const rect = canvasEl.getBoundingClientRect()
    const x = Math.floor(((clientX - rect.left) / rect.width) * SIZE)
    const y = Math.floor(((clientY - rect.top) / rect.height) * SIZE)
    undoState = ctx.getImageData(0, 0, SIZE, SIZE)
    floodFill(ctx, x, y, fillColor)
  }

  export function toPngBlob(): Promise<Blob | null> {
    return new Promise((resolve) => canvasEl.toBlob(resolve, 'image/png'))
  }

  function floodFill(c: CanvasRenderingContext2D, sx: number, sy: number, hex: string) {
    const img = c.getImageData(0, 0, SIZE, SIZE)
    const data = img.data
    const idx = (x: number, y: number) => (y * SIZE + x) * 4
    const start = idx(sx, sy)
    const target = [data[start], data[start + 1], data[start + 2]]
    const [fr, fg, fb] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
    if (target[0] === fr && target[1] === fg && target[2] === fb) return
    const match = (i: number) =>
      Math.abs(data[i] - target[0]) < 24 &&
      Math.abs(data[i + 1] - target[1]) < 24 &&
      Math.abs(data[i + 2] - target[2]) < 24
    const stack = [[sx, sy]]
    while (stack.length) {
      const [x, y] = stack.pop()!
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue
      const i = idx(x, y)
      if (!match(i)) continue
      data[i] = fr; data[i + 1] = fg; data[i + 2] = fb; data[i + 3] = 255
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    c.putImageData(img, 0, 0)
  }
</script>

<canvas
  bind:this={canvasEl}
  width={SIZE}
  height={SIZE}
  class:locked
  onpointerdown={down}
  onpointermove={move}
  onpointerup={up}
  onpointercancel={up}
></canvas>

<style>
  canvas {
    width: min(88vw, 52vh, 26rem);
    height: min(88vw, 52vh, 26rem);
    border-radius: 1.2rem;
    border: 1px solid var(--line);
    background: #faf9f5; /* fixed paper — theme never touches this */
    touch-action: none; /* no scroll/zoom bleed mid-stroke */
    box-shadow: 0 6px 24px rgba(38, 38, 36, 0.08);
    cursor: crosshair;
  }
  canvas.locked { pointer-events: none; opacity: 0.9; }
</style>
