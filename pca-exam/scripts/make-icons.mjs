// PWA/iOS 아이콘 PNG 생성 (의존성 없이 zlib만 사용). 실행: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
// 선분까지 거리
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}
function render(size, { rounded, pad }) {
  const S = 512
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = [0]
    for (let x = 0; x < size; x++) {
      let cov = [0, 0, 0, 0] // 4x 슈퍼샘플링
      let r = 0, g = 0, b = 0, a = 0
      for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) {
        const u = ((x + (sx + 0.5) / 2) / size) * S, v = ((y + (sy + 0.5) / 2) / size) * S
        // 배경
        let inBg = true
        if (rounded) {
          const R = 112, cx = Math.min(Math.max(u, R), S - R), cy = Math.min(Math.max(v, R), S - R)
          inBg = Math.hypot(u - cx, v - cy) <= R
        }
        if (!inBg) continue
        // 내용 축소(maskable 안전영역)
        const k = pad, uu = (u - 256) / k + 256, vv = (v - 256) / k + 256
        const ring = Math.abs(Math.hypot(uu - 256, vv - 256) - 150) <= 18
        const check = Math.min(segDist(uu, vv, 186, 262, 236, 312), segDist(uu, vv, 236, 312, 332, 202)) <= 20
        const white = ring || check
        r += white ? 255 : 0x1a; g += white ? 255 : 0x73; b += white ? 255 : 0xe8; a += 255
      }
      row.push(Math.round(r / 4), Math.round(g / 4), Math.round(b / 4), Math.round(a / 4))
    }
    rows.push(Buffer.from(row))
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
writeFileSync('public/icon-192.png', render(192, { rounded: true, pad: 1 }))
writeFileSync('public/icon-512.png', render(512, { rounded: true, pad: 1 }))
writeFileSync('public/icon-512-maskable.png', render(512, { rounded: false, pad: 0.72 }))
writeFileSync('public/apple-touch-icon.png', render(180, { rounded: false, pad: 0.9 }))
console.log('icons written')
