import { ArcRotateCamera, DirectionalLight, Engine, Mesh, Scene, SceneLoader, ShadowGenerator, Vector3 } from "@babylonjs/core";
import { FC, useEffect, useRef } from "react";

const AmcPage: FC = () => {
  const outRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<boolean>(false)

  // 创建场景
  const createScene = (engine: Engine) => {
    const w = outRef.current?.clientWidth || 0
    const h = outRef.current?.clientHeight || 0
    ref.current!.width = w
    ref.current!.height = h

    const scene = new Scene(engine)

    
    // 加载GLB文件
    SceneLoader.Append("/public/glb/", "00_atv-all_V1.7-3.glb", scene, (scene) => {
      // GLB文件加载完成后的回调
      scene.createDefaultCameraOrLight(true, true, true);
    });

    return scene
  }

  const globalLight = (scene: Scene) => {
    const light = new DirectionalLight('dir', new Vector3(0, -1, -1), scene)
    light.position = new Vector3(0, 30, 50);
    light.intensity = 0.5

    return light
  }

  const shadowControl = (light: DirectionalLight) => {
    const shadowGenerator = new ShadowGenerator(1024, light)
    return (target: Mesh) => {
      shadowGenerator.addShadowCaster(target, true)
    }
  }

  const createCamera = (scene: Scene) => {
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 1250, new Vector3(0, 60, 0), scene)
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(ref.current, true)
    return camera
  }

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true

      const engine = new Engine(ref.current, true)

      const scenne = createScene(engine)

      createCamera(scenne)

      const light = globalLight(scenne)

      shadowControl(light)

      engine.runRenderLoop(() => {
        scenne.render()
      })
    }
  }, [renderRef])

  return (
    <div className="full-width full-height" ref={outRef}>
      <canvas ref={ref}></canvas>
    </div>
  )
}

export default AmcPage
