import { Animation, ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core"
import { useEffect, useRef } from "react"
import earcut from 'earcut'

const CarPage = () => {
  const outRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<boolean>(false)
  const createScene =  (engine: Engine) => {
    const scene = new Scene(engine);
    const w = outRef.current?.clientWidth || 0
    const h = outRef.current?.clientHeight || 0
    ref.current!.width = w
    ref.current!.height = h
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
    camera.attachControl(ref.current, true);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
    const car = buildCar(scene);
    car.rotation.x = -Math.PI / 2;

    return scene;
  }
  const buildCar = (scene: Scene) => {
    
    //base
    const outline = [
        new Vector3(-0.3, 0, -0.1),
        new Vector3(0.2, 0, -0.1),
    ]

    //curved front
    for (let i = 0; i < 20; i++) {
        outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
    }

    //top
    outline.push(new Vector3(0, 0, 0.1));
    outline.push(new Vector3(-0.3, 0, 0.1));

    //back formed automatically

    //car face UVs
    const faceUV = [];
    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new Vector4(0, 0, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

    //car material
    const carMat = new StandardMaterial("carMat");
    carMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png");

    const car = MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true}, scene, earcut);
    car.material = carMat;

    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new Vector4(0, 0, 1, 1);
    wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new Vector4(0, 0, 1, 1);
    
    //car material
    const wheelMat = new StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png");

    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    
    const animWheel = new Animation('wheelAnimation', 'rotation.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // 关键帧
    const wheelKeys = []
    wheelKeys.push({
        frame: 0,
        value: 0
    })
    wheelKeys.push({
        frame: 30,
        value: 2 * Math.PI
    })

    animWheel.setKeys(wheelKeys)

    wheelRB.animations = []
    wheelRB.animations.push(animWheel)

    scene.beginAnimation(wheelRB, 0, 30, true)
    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);

    return car;
  }
  useEffect(() => {
    if (!renderRef.current) {
      const engine = new Engine(ref.current, true)
      const sence = createScene(engine)
      engine.runRenderLoop(() => {
        sence.render()
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

export default CarPage

