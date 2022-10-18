import gsap from 'gsap'
import { setWindowResizeEvent } from '@/modules/setWindowResizeEvent/setWindowResizeEvent'
import { createKeenSlider } from '@/modules/createKeenSlider/createKeenSlider'
import { createPixi } from '@/modules/createPixi/createPixi'
import { createFetch } from '@/modules/createFetch/createFetch'
import { createAxios } from '@/modules/createAxios/createAxios'
import { createIntersectionObserver } from '@/modules/createIntersectionObserver/createIntersectionObserver'
import { setRoutine } from '@/modules/setRoutine/setRoutine'
import { createChart } from '@/modules/createChart/createChart'
import { createResultMap } from '@/modules/createResultMap/createResultMap'

window.onload = () => {
  // 開発と本番のどちらの環境かを取得
  console.log(process.env.NODE_ENV) // development || production
  // 環境変数を取得
  console.log(process.env.APP_URL)

  // Sample: windowリサイズ時の処理
  setWindowResizeEvent<() => void>({
    callback: () => console.log('windowリサイズ時のcallbackです'),
    offset: 200
  })

  // Sample: 画面縦幅100vhでの表示
  setWindowResizeEvent<() => void>({
    callback: () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      console.log(vh)
    },
    offset: 200
  })

  // Sample: keen-slider
  const keenSlider = createKeenSlider({
    el: '.keen-slider',
    options: {
      loop: true,
      created: () => {
        console.log('created')
      }
    }
  })

  // Sample: PixiJS
  const pixiWrapper = document.querySelector('.pixi') as HTMLElement
  const app = createPixi()
  pixiWrapper.appendChild(app.view)

  // Sample: chart.js
  const myChartArea = document.getElementById('myChart') as HTMLCanvasElement
  createChart({ el: myChartArea })

  // Sample: Fetch
  const getDataByFetch = async () => {
    const fetcher = createFetch({
      baseUrl: 'https://jsonplaceholder.typicode.com'
    })
    await fetcher({
      path: '/todos'
    })
      .then((res) => {
        if (!res.ok) {
          console.log('エラーが発生しました')
          return
        }
        res.json().then(
          (
            encoded: {
              userId: number
              id: number
              title: string
              completed: boolean
            }[]
          ) => {
            console.log(encoded)
          }
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }
  getDataByFetch()

  // Sample: axios
  type ResUserType = {
    id: number
    name: string
    username: string
    email: string
    address: {
      street: string
      suite: string
      city: string
      zipcode: string
      geo: {
        lat: string
        lng: string
      }
    }
    phone: string
    website: string
    company: {
      name: string
      catchPhrase: string
      bs: string
    }
  }

  const getDataByAxios = createAxios({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 60 * 1000, // 1分
    responseType: 'json'
  })
  getDataByAxios
    .get<ResUserType[]>('/users')
    .then((res) => {
      res.data.map((user) => {
        console.log(user)
      })
    })
    .catch((err) => {
      console.log(err)
    })

  // Sample: Intersection Observer
  const observer = createIntersectionObserver({
    options: {
      root: null, // nullを指定すると、ルート要素はビューポートとなる
      rootMargin: '-20px 0px', // ビューポート最下部から上部へ20px地点を交差判定域とする
      threshold: 0
    },
    callback: (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Sample: gsap
          // https://greensock.com/gsap/
          gsap.to(entry.target, {
            scale: 1,
            duration: 0.4, // 0.4秒間かけて行う
            ease: 'power2.inOut', // アニメーションのイージングを指定
            delay: 0 + index * 0.5 // 要素の数分だけdelayを適用
          })
        }
      })
    }
  })
  // 観察対象をセット
  document.querySelectorAll('.observerArea').forEach((el) => {
    observer.observe(el)
  })

  // Sample: ルーチン
  const routine = setRoutine({
    interval: 3 * 1000,
    callback: () => {
      console.log('再帰処理')
    }
  })
  // ルーチン開始
  routine.start()
  // ルーチン停止
  window.setTimeout(() => {
    routine.stop()
  }, 10 * 1000)

  // Sample: ResultMap
  /**
   * maybeErrorFunc
   * エラーが発生するかもしれない関数
   * createResultMapのサンプルコード
   */
  const maybeErrorFunc = () => {
    const getRandomNum = () => {
      const r = Math.random()
      if (r < 0.2) {
        throw new Error('getRandomNum内エラー')
      }
      return r
    }
    const result = createResultMap<number>(getRandomNum)
    if (result.get('data')) {
      console.log('成功: ', result.get('data'))
    }
    if (result.get('error')) {
      console.log('エラー: ', result.get('error'))
    }
  }
  maybeErrorFunc()
}
