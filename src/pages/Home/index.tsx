import { useEffect, useRef } from "react"
import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core"

const HomePage = () => {
  const outRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<boolean>(false)
  useEffect(() => {
    if (!renderRef.current) {
      const w = outRef.current?.clientWidth || 0
      const h = outRef.current?.clientHeight || 0
      ref.current!.width = w
      ref.current!.height = h
      renderRef.current = true
      const engine = new Engine(ref.current, true)

      const scene = new Scene(engine)

      const camera = new ArcRotateCamera('camera', -Math.PI/2, Math.PI / 2.5, 3, new Vector3(0,0,0), scene)
      camera.attachControl(ref.current, true)

      new HemisphericLight('light', new Vector3(0,1,1), scene)

      MeshBuilder.CreateBox('box', {}, scene)

      engine.runRenderLoop(() => {
        scene.render()
      })
    }
    return () => {
      renderRef.current = true
    }
  }, [renderRef])
  return (
    <div ref={outRef} className="full-width full-height flex-col flex-jst-start flex-ali-start">
      <canvas ref={ref}></canvas>
    </div>
  )
}

export default HomePage
