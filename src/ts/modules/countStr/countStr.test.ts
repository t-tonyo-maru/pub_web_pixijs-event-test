import { countStr } from './countStr'
// import { countStr } from '@/modules/countStr/countStr'

describe('ゼロパディング', () => {
  // 文字列カウントテスト
  test('aiueo = 5文字', () => {
    expect(countStr('aiueo')).toBe(5)
  })

  test('kakikukeko = 10文字', () => {
    expect(countStr('kakikukeko')).toBe(10)
  })

  test('𠮷野家 = 3文字', () => {
    expect(countStr('𠮷野家')).toBe(3)
  })

  test('😄💢✋ = 3文字', () => {
    expect(countStr('😄💢✋')).toBe(3)
  })

  test('👨‍👩‍👧‍👦 = 1文字', () => {
    expect(countStr('👨‍👩‍👧‍👦')).toBe(1)
  })
})
