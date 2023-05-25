import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core"
import { useEffect, useRef } from "react"

const Village = () => {
  const outRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<boolean>(false)
  const createScene = (engine: Engine) => {
    const w = outRef.current?.clientWidth || 0
    const h = outRef.current?.clientHeight || 0
    ref.current!.width = w
    ref.current!.height = h

    const scene = new Scene(engine)

    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene)
    camera.attachControl(ref.current, true)

    const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    // 上面三要素不用说了噻
    // 地面
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)

    // 房顶
    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3}, scene);
    roof.position.y = 1.22
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2

    // 绿色场地
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);
    ground.material = groundMat; //Place the material property of the ground

    // 房顶材质
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    roof.material = roofMat;

    // 房屋材质
    const boxMat = new StandardMaterial("boxMat");
    boxMat.diffuseTexture = new Texture("https://doc.babylonjs.com/img/getstarted/cubehouse.png", scene);

    const faceUV = [];
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    const box = MeshBuilder.CreateBox('box', {faceUV: faceUV, wrap: true}, scene)
    box.material = boxMat;
    box.position.y = 0.5

    // 长房子 https://doc.babylonjs.com/img/getstarted/semihouse.png
    const longUV = [];
    longUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    longUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    longUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    longUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    const longBox = MeshBuilder.CreateBox('longBox', {faceUV: longUV, wrap: true, width: 2, height: 1, depth: 1}, scene)
    const longBoxMat = new StandardMaterial("longBoxMat");
    longBoxMat.diffuseTexture = new Texture("https://doc.babylonjs.com/img/getstarted/semihouse.png", scene);
    longBox.material = boxMat;
    longBox.position.y = 0.5
    longBox.position.x = 2.5
    // 长房子房顶
    const longRoof = MeshBuilder.CreateCylinder("longRoof", {diameter: 1.3, height: 2.2, tessellation: 3}, scene);
    longRoof.position.y = 1.22
    longRoof.position.x = 2.5
    longRoof.scaling.x = 0.75
    longRoof.rotation.z = Math.PI / 2
    longRoof.material = roofMat;

    return scene
  }
  useEffect(() => {
    if (!renderRef.current) {
      const engine = new Engine(ref.current, true)

      const scenne = createScene(engine)

      engine.runRenderLoop(() => {
        scenne.render()
      })
    }
    return () => {
      renderRef.current = true
    }
  }, [renderRef])
  return (
    <div className="full-width full-height" ref={outRef}>
      <canvas ref={ref}></canvas>
    </div>
  )
}

export default Village
