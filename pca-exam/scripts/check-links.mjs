// refs의 공식 문서 링크가 실제로 열리는지(HTTP 200) 확인. 실행: npm run check-links
// 네트워크가 필요하며 curl을 사용한다(프록시 환경변수 자동 적용).
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { QUESTIONS } from '../src/questions.js'
import { CASE_STUDIES, CASE_QUESTIONS } from '../src/caseStudies.js'

const run = promisify(execFile)
const urls = new Map()
for (const q of [...QUESTIONS, ...CASE_QUESTIONS])
  for (const r of q.refs || []) {
    if (!urls.has(r.url)) urls.set(r.url, [])
    urls.get(r.url).push(q.id)
  }
for (const c of CASE_STUDIES) if (c.pdf) urls.set(c.pdf, [c.id])

async function status(url) {
  try {
    const { stdout } = await run('curl', ['-s', '-L', '-o', '/dev/null', '-w', '%{http_code} %{url_effective}', '--max-time', '30', url])
    const [code, final] = stdout.trim().split(' ')
    return { code: Number(code), final }
  } catch (e) {
    return { code: 0, final: String(e.message).slice(0, 80) }
  }
}

const list = [...urls.keys()]
const bad = []
let i = 0
async function worker() {
  while (i < list.length) {
    const url = list[i++]
    let r = await status(url)
    if (r.code !== 200) r = await status(url) // 일시 오류 대비 1회 재시도
    if (r.code !== 200) bad.push({ url, ...r, ids: urls.get(url) })
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
console.log(`링크 ${list.length}개 확인, 실패 ${bad.length}개`)
for (const b of bad) console.log(`  ${b.code} ${b.url} (${b.ids.slice(0, 5).join(', ')})`)
process.exit(bad.length ? 1 : 0)
