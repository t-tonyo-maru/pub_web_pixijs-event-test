/**
 * デバイスがタッチ可能かを判定する
 *
 * @return {boolean} - true: タッチ可能なデバイス, false: タッチ不可なデバイス。
 */
export const getIsTouchableDevice = () => {
  return (
    typeof window.ontouchstart !== 'undefined' &&
    window.navigator.maxTouchPoints > 0
  )
}
