import { caseById } from '../caseStudies.js'

export default function CaseSummary({ caseId, compact }) {
  const c = caseById[caseId]
  if (!c) return null
  const Section = ({ title, items }) => (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
  return (
    <div className={`casesummary ${compact ? 'compact' : ''}`}>
      <h3>
        {c.name} <span className="chip">{c.industry}</span>
      </h3>
      <p>{c.overview}</p>
      <Section title="기존 기술 환경" items={c.environment} />
      <Section title="비즈니스 요구사항" items={c.business} />
      <Section title="기술 요구사항" items={c.technical} />
      <h4>경영진 메시지(요지)</h4>
      <p>{c.executive}</p>
      <p className="small">
        원문(영문 PDF):{' '}
        <a href={c.pdf} target="_blank" rel="noreferrer">
          공식 케이스 스터디
        </a>
      </p>
    </div>
  )
}
