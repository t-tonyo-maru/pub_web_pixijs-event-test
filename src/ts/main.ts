import * as PIXI from 'pixi.js'
import { getIsTouchableDevice } from '@/modules/getIsTouchableDevice/getIsTouchableDevice'

// 画像格納先
const staticPath =
  process.env.NODE_ENV === 'production' ? '/assets/images' : '/assets/images'
// タッチ可能か
const isTauchable = getIsTouchableDevice(window)
// 拡大縮小率
let scaleRato = 1
// 拡大縮小の最大値
const scalesRange = {
  min: 1,
  max: 20
}

// consoleのバナーを非表示にする
PIXI.utils.skipHello()

window.onload = () => {
  console.log('タッチ可能か: ', isTauchable)

  const wrapper = document.getElementById('js-canvas_wrapper') as HTMLElement

  // 画面解像度の比率
  const pixelRatio = window.devicePixelRatio || 1
  const app = new PIXI.Application({
    antialias: true,
    autoDensity: true, // 解像度1以外に対応できるよう、CSSピクセル単位でレンダラービューをリサイズできるようにするか否か
    resolution: pixelRatio / 1, // rendererのデバイスピクセル比
    height: window.innerHeight,
    width: window.innerWidth
  })

  // コンテナを用意
  const container = new PIXI.Container()
  container.pivot.set(0.5)
  // container.pivot.x = 0.5
  // container.pivot.y = 0.5
  // コンテナをy軸反転
  container.position.y = app.renderer.height / app.renderer.resolution
  container.scale.y = -1
  // windowリサイズ時の処理を設置
  const observer = new ResizeObserver(() => {
    // canvas等をリサイズ
    app.view.style.height = `${wrapper.clientHeight}px`
    app.view.style.width = `${wrapper.clientWidth}px`
    app.view.height = wrapper.clientHeight * pixelRatio
    app.view.width = wrapper.clientWidth * pixelRatio
    app.renderer.resize(
      app.view.width / pixelRatio,
      app.view.height / pixelRatio
    )
    // コンテナのy軸を反転
    container.position.y = app.renderer.height / app.renderer.resolution
    container.scale.y = -1
  })
  observer.observe(wrapper)

  // image sample
  const bunnyTexture = PIXI.Texture.from(`${staticPath}/bunny.png`)
  bunnyTexture.rotate = 8
  const bunnySprite = new PIXI.Sprite(bunnyTexture)
  bunnySprite.anchor.set(0.5)
  bunnySprite.x = 400
  bunnySprite.y = 400
  container.addChild(bunnySprite)

  // Rectangle
  const graphics = new PIXI.Graphics()
  graphics.beginFill(0xff3300)
  graphics.lineStyle(4, 0xffd900, 1)
  graphics.moveTo(0, 0)
  graphics.lineTo(350, 350)
  graphics.lineTo(100, 400)
  graphics.lineTo(50, 350)
  graphics.closePath()
  graphics.endFill()
  // add stage
  container.addChild(graphics)

  // canvasをhtmlへセット
  wrapper.appendChild(app.view)
  // コンテナをstageに追加
  app.stage.addChild(container)

  /****************************************
   *
   * イベントセット
   *
   ****************************************/
  /**
   * PC: ホイールイベント
   */
  app.view.addEventListener('wheel', (event) => {
    event.preventDefault()
    // ホイール量
    const wheelSize = (event.deltaY / 1000) * -1
    // x軸のサイズを元にしたスケール
    const scaleSize = container.scale.x + wheelSize
    // スケールサイズ
    const scale = Math.min(
      Math.max(scalesRange.min, scaleSize),
      scalesRange.max
    )
    // スケールサイズを適用
    container.scale.set(scale, scale * -1)
    // 拡大縮小率を更新
    scaleRato = scale

    container.position.set(container.position.x, container.position.y)
    console.log(event.clientX, event.clientY)
    console.log(container.position)
  })

  /**
   * PC: ドラッグイベント
   * ※本当は isTauchable でイベントを設置するか否かを分けた方が良い。
   */
  let isDraggingOnPc = false
  const dragPositionOnPc = {
    x: 0,
    y: 0
  }
  app.view.addEventListener('mousedown', (event) => {
    event.preventDefault()
    // タッチデバイスの場合は処理を止める
    if (isTauchable) return
    // ドラッグ中フラグON
    isDraggingOnPc = true
    // ドラッグ開始時の位置を保持
    dragPositionOnPc.x = event.clientX
    dragPositionOnPc.y = event.clientY
  })
  app.view.addEventListener('mousemove', (event) => {
    event.preventDefault()
    // タッチデバイスの場合は処理を止める
    if (isTauchable) return
    // ドラッグ中フラグONの場合のみ実行する
    if (!isDraggingOnPc) return
    // ドラッグ距離の差分を計算
    const diff = {
      x: event.clientX - dragPositionOnPc.x,
      y: event.clientY - dragPositionOnPc.y
    }
    // コンテナを差分だけ移動させる
    container.position.set(container.x + diff.x, container.y + diff.y)
    // mousemoveイベントからドラッグの位置を更新
    dragPositionOnPc.x = event.clientX
    dragPositionOnPc.y = event.clientY
  })
  app.view.addEventListener('mouseup', (event) => {
    event.preventDefault()
    // タッチデバイスの場合は処理を止める
    if (isTauchable) return
    // ドラッグ中フラグOFF
    isDraggingOnPc = false
  })

  /**
   * SP: ドラッグイベント
   * ※本当は isTauchable でイベントを設置するか否かを分けた方が良い。
   *
   * 未テスト
   */
  let isDraggingOnTouchDevice = false
  const dragPositionOnTouchDevice = {
    x: 0,
    y: 0
  }
  app.view.addEventListener('touchstart', (event) => {
    event.preventDefault()
    // タッチ可能デバイスのみ処理を実行する
    if (!isTauchable) return
    // タッチしている指が1本の場合のみドラッグ扱いとする
    if (event.touches.length !== 1) return
    // ドラッグ中フラグON
    isDraggingOnTouchDevice = true
    // ドラッグ開始時の位置を保持
    dragPositionOnTouchDevice.x = event.touches[0].clientX
    dragPositionOnTouchDevice.y = event.touches[0].clientY
  })
  app.view.addEventListener('touchmove', (event) => {
    event.preventDefault()
    // タッチ可能デバイスのみ処理を実行する
    if (!isTauchable) return
    // タッチしている指が1本の場合のみドラッグ扱いとする
    if (event.touches.length !== 1) return
    // ドラッグ中フラグONの場合のみ実行する
    if (!isDraggingOnTouchDevice) return
    // ドラッグ距離の差分を計算
    const diff = {
      x: event.touches[0].clientX - dragPositionOnTouchDevice.x,
      y: event.touches[0].clientY - dragPositionOnTouchDevice.y
    }
    // コンテナを差分だけ移動させる
    container.position.set(container.x + diff.x, container.y + diff.y)
    // mousemoveイベントからドラッグの位置を更新
    dragPositionOnTouchDevice.x = event.touches[0].clientX
    dragPositionOnTouchDevice.y = event.touches[0].clientY
  })
  app.view.addEventListener('mouseup', (event) => {
    event.preventDefault()
    // タッチ可能デバイスのみ処理を実行する
    if (!isTauchable) return
    // ドラッグ中フラグOFF
    isDraggingOnTouchDevice = false
  })
}
