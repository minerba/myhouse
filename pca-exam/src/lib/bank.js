// 챕터 문제 + 케이스 문제를 하나의 은행으로 묶는다.
import { QUESTIONS } from '../questions.js'
import { CASE_QUESTIONS } from '../caseStudies.js'

export const ALL_QUESTIONS = [...QUESTIONS, ...CASE_QUESTIONS]
const byId = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))
export const getQuestion = (id) => byId.get(id)
export const isMulti = (q) => q.answer.length > 1
export const sourceLabel = (q) => (q.caseId ? `케이스: ${q.caseId}` : `Chapter ${q.chapter}`)
