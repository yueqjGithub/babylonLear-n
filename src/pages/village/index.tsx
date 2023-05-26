import { ArcRotateCamera, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core"
import { useEffect, useRef } from "react"

const Village = () => {
  const outRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<boolean>(false)
  // 创建房子
  const buildHouse = (
    positionX: number,
    positionY: number,
    type: 'box' | 'longBox',
    scene: Scene,
    positionZ?: number
  ) => {
    const UV = [];
    if (type === 'box') {
      UV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      UV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      UV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      UV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    } else {
      UV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      UV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      UV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      UV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    }
    const boxMat = new StandardMaterial("boxMat");
    const box = MeshBuilder.CreateBox('longBox', {faceUV: UV, wrap: true, width: type === 'box' ? 1 : 2, height: 1, depth: 1}, scene)
    box.material = boxMat;
    boxMat.diffuseTexture = new Texture(`https://doc.babylonjs.com/img/getstarted/${type === 'box' ? 'cubehouse' : 'semihouse'}.png`, scene);
    box.position.y = positionY
    box.position.x = positionX

    // 房顶
    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: type === 'box' ? 1.2 : 2.2, tessellation: 3}, scene);
    // 房顶材质
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    roof.material = roofMat;
    roof.position.y = 1.22
    roof.position.x = positionX
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2

    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
    house!.position.z = positionZ || 0
    return house
  }
  // 创建场景
  const createScene = (engine: Engine) => {
    const w = outRef.current?.clientWidth || 0
    const h = outRef.current?.clientHeight || 0
    ref.current!.width = w
    ref.current!.height = h

    const scene = new Scene(engine)

    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 20, new Vector3(0, 0, 0), scene)
    camera.attachControl(ref.current, true)

    const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    // 上面三要素不用说了噻
    // 地面
    const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)

    // 绿色场地
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);
    ground.material = groundMat; //Place the material property of the ground
    return scene
  }

  const putHouses = (scenne: Scene) => {
    const houseInstance = buildHouse(0, 0.5, 'box', scenne)
    const bigHouseInstance = buildHouse(2.5, 0.5, 'longBox', scenne)

    houseInstance!.rotation.y = Math.PI / 4

    const sHouse1 = houseInstance!.clone("iHouse1");
    sHouse1.position.x = 0.5;
    sHouse1.position.z = -1.5;
    sHouse1.rotation.y = Math.PI / 2;

    bigHouseInstance!.position.x = 0.5;
    bigHouseInstance!.position.z = -1;
    bigHouseInstance!.rotation.y = Math.PI / 2;

    const sHouse2 = sHouse1.createInstance('iHouse2');
    sHouse2.position.z = -5.5

    const lHouse1 = bigHouseInstance!.clone('lHouse1')
    lHouse1.position.z = -5

    const lHouse2 = buildHouse(-2, 0.5, 'longBox', scenne)
    // lHouse2!.position.x = -2
    lHouse2!.position.z = 0.5
    // lHouse2!.rotation.y = 0

    const sHouse3 = buildHouse(-4, 0.5, 'box', scenne)
    sHouse3!.position.z = 0.5

    const lHouse3 = lHouse2!.createInstance('lHouse3')
    lHouse3.position.x = -4

    const sHouse4 = sHouse3?.createInstance('sHouse4')
    sHouse4!.position.x = -4

    const sHouse5 = sHouse4?.clone('sHouse5')
    sHouse5!.position.z = 4

    const sHouse6 = sHouse5?.clone('sHouse6')
    sHouse6!.position.x = -2.5

    const sHouse7 = sHouse6?.clone('sHouse7')
    sHouse7!.position.x = -1

    const lHouse4 = buildHouse(0, 0.5, 'longBox', scenne)
    lHouse4!.position.z = 4
    lHouse4!.position.x = -3

    const lHouse5 = lHouse4?.clone('lHouse5')
    lHouse5!.position.x = -0.5
    lHouse5!.position.z = 4.5
    lHouse5!.rotation.y = -Math.PI / 6

    const lHouse6 = lHouse5?.clone('lHouse6')
    lHouse6!.position.x = 1
    lHouse6!.position.z = 6.5
    lHouse6!.rotation.y = -Math.PI / 2

    const sHouse8 = buildHouse(0, 0.5, 'box', scenne)
    sHouse8!.position.z = 8.5
    sHouse8!.position.x = 1
    sHouse8!.rotation.y = Math.PI / 2

    const rHouse = buildHouse(0, 0.5, 'longBox', scenne, 0)
    rHouse!.rotation.y = Math.PI / 2
    rHouse!.position.x = 5
    rHouse!.position.z = -7.5

    const rHouse1 = rHouse?.clone('rHouse1')
    rHouse1!.position.z = -5
    rHouse1!.position.x = 5

    const rHouse2 = rHouse?.clone('rHouse2')
    rHouse2!.position.z = -2.5
    rHouse2!.position.x = 5

    const rHouse3 = rHouse?.clone('rHouse3')
    rHouse3!.position.z = 0
    rHouse3!.position.x = 5.5
    rHouse3!.rotation.y = Math.PI / 1.7

    const rHouse4 = rHouse?.clone('rHouse4')
    rHouse4!.position.z = 2.5
    rHouse4!.position.x = 6.5
    rHouse4!.rotation.y = Math.PI / 1.6

    const rHouse5 = rHouse?.clone('rHouse5')
    rHouse5!.position.z = 5
    rHouse5!.position.x = 8.5
    rHouse5!.rotation.y = Math.PI / 1.2
  }

  useEffect(() => {
    if (!renderRef.current) {
      const engine = new Engine(ref.current, true)

      const scenne = createScene(engine)
      putHouses(scenne)

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
