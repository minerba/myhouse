// 챕터 문제 은행 집계. 문제 본문은 src/data/chapters/chNN.js 에 있다.
import ch01 from './data/chapters/ch01.js'
import ch02 from './data/chapters/ch02.js'
import ch03 from './data/chapters/ch03.js'
import ch04 from './data/chapters/ch04.js'
import ch05 from './data/chapters/ch05.js'
import ch06 from './data/chapters/ch06.js'
import ch07 from './data/chapters/ch07.js'
import ch08 from './data/chapters/ch08.js'
import ch09 from './data/chapters/ch09.js'
import ch10 from './data/chapters/ch10.js'

export const CHAPTERS = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10]
export const QUESTIONS = CHAPTERS.flat()
export const questionById = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]))
