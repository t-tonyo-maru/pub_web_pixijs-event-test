import * as PIXI from 'pixi.js'

// 画像格納先
const staticPath =
  process.env.NODE_ENV === 'production' ? '/assets/images' : '/assets/images'
// consoleのバナーを非表示にする
PIXI.utils.skipHello()

window.onload = () => {
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
  // src/static/images/bunny.png

  const bunnyTexture = PIXI.Texture.from(`${staticPath}/bunny.png`)
  bunnyTexture.rotate = 8
  const bunnySprite = new PIXI.Sprite(bunnyTexture)
  bunnySprite.anchor.set(0.5)
  // bunnySprite.angle = 180
  // bunnySprite.angle = 180
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
}
