import { AbstractMesh, Animation, ArcRotateCamera, Axis, Color3, Color4, CubeTexture, DirectionalLight, Engine, HemisphericLight, Mesh, MeshBuilder, ParticleSystem, PointerEventTypes, Scene, SceneLoader, ShadowGenerator, Space, SpotLight, Sprite, SpriteManager, StandardMaterial, Texture, Tools, Vector3, Vector4 } from "@babylonjs/core"
import * as GUI from '@babylonjs/gui'
import { useEffect, useRef } from "react"
import earcut from 'earcut'

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
    const box = MeshBuilder.CreateBox('longBox', { faceUV: UV, wrap: true, width: type === 'box' ? 1 : 2, height: 1, depth: 1 }, scene)
    box.material = boxMat;
    boxMat.diffuseTexture = new Texture(`https://doc.babylonjs.com/img/getstarted/${type === 'box' ? 'cubehouse' : 'semihouse'}.png`, scene);
    box.position.y = positionY
    box.position.x = positionX

    // 房顶
    const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: type === 'box' ? 1.2 : 2.2, tessellation: 3 }, scene);
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

    

    // 上面三要素不用说了噻
    // 地面
    // const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)

    // // 绿色场地
    // const groundMat = new StandardMaterial("groundMat");
    // groundMat.diffuseColor = new Color3(0, 1, 0);
    // ground.material = groundMat; //Place the material property of the ground

    return scene
  }
  const createCamera = (scene: Scene) => {
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 1250, new Vector3(0, 60, 0), scene)
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(ref.current, true)
    return camera
  }

  // const globalLight = (scene: Scene) => {
  //   const light = new HemisphericLight('light', new Vector3(4, 1, 0), scene)
  //   light.intensity = 0.5
  //   return light
  // }

  const globalLight = (scene: Scene) => {
    const light = new DirectionalLight('dir', new Vector3(0,-1,-1), scene)
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

  const genGround = (scene: Scene) => {

    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 });
    ground.material = groundMat;

    const largeGroundMat = new StandardMaterial('largeGroundMat')
    largeGroundMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/valleygrass.png')

    const largeGround = MeshBuilder.CreateGroundFromHeightMap('largeGround', 'https://doc.babylonjs.com/img/getstarted/villageheightmap.png', { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }, scene)
    largeGround.material = largeGroundMat
    largeGround.position.y = -0.01;

    ground.receiveShadows = true;
  }

  const genSky = (scene: Scene) => {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/sky/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }

  const genTrees = (scene: Scene) => {
    const spriteManagerTrees = new SpriteManager('treeManager', '/sprite/palmtree.png', 2000, { width: 512, height: 1024 }, scene)
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite('tree', spriteManagerTrees)
      tree.position.x = Math.random() * (-30)
      tree.position.z = Math.random() * 20 + 8
      tree.position.y = 0.5
    }
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite("tree", spriteManagerTrees);
      tree.position.x = Math.random() * (25) + 7;
      tree.position.z = Math.random() * -35 + 8;
      tree.position.y = 0.5;
    }
  }

  // const genUfo = (scene: Scene) => {
  //   const spriteManagerUfo = new SpriteManager('ufo', '/sprite/ufo.png', 2000, { width: 128, height: 76 }, scene)
  //   const ufo = new Sprite('ufo', spriteManagerUfo)
  //   ufo.position.y = 3
  //   ufo.position.x = 2
  //   ufo.playAnimation(0, 16, true, 125)
  // }

  const genFountain = (scene: Scene) => {
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(10, 4, 0),
      new Vector3(8, 4, 0),
      new Vector3(8, 1, 0),
      new Vector3(1, 2, 0),
      new Vector3(1, 15, 0),
      new Vector3(3, 17, 0)
    ]
    const fountainer = MeshBuilder.CreateLathe('fountain', { shape: fountainProfile, sideOrientation: Mesh.DOUBLESIDE }, scene)
    // fountainer.position.y = 0.1
    fountainer.position.x = -5
    fountainer.position.z = -4
    fountainer.scaling = new Vector3(0.05, 0.05, 0.05)

    // 粒子
    const particleSystem = new ParticleSystem('particles', 5000, scene)
    particleSystem.particleTexture = new Texture('/texture/flare.png', scene)
    // 发射区域
    particleSystem.emitter = new Vector3(-5, 0.8, -4)
    particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01)
    particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01)

    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0)
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0)
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE

    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;

    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    particleSystem.emitRate = 1500;

    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, -1);

    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.6;
    particleSystem.updateSpeed = 0.01;

    particleSystem.gravity = new Vector3(0, -9.81, 0);

    particleSystem.start();

    let switched = true

    const pinterDown = (mesh: AbstractMesh) => {
      if (mesh === fountainer) {
        switched = !switched
        if (switched) {
          particleSystem.start()
        } else {
          particleSystem.stop()
        }
      }
    }

    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo?.hit) {
            pinterDown(pointerInfo.pickInfo.pickedMesh!)
          }
          break
      }
    })
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

  const genCar = (scene: Scene, genShadow: any) => {

    // 车身UV
    const faceUV = new Array(2)
    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new Vector4(0, 0, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
    const faceMat = new StandardMaterial("faceMat");
    faceMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png", scene);

    const outline = [
      new Vector3(-0.3, 0, -0.1),
      new Vector3(0.2, 0, -0.1),
    ]
    for (let i = 0; i < 20; i++) {
      outline.push(
        new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1)
      )
    }
    outline.push(new Vector3(-0.3, 0, 0.1))
    outline.push(new Vector3(-0.3, 0, -0.1))

    const car = MeshBuilder.ExtrudePolygon('car', { shape: outline, depth: 0.2, faceUV, wrap: true }, scene, earcut)
    car.material = faceMat

    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new Vector4(0, 0, 1, 1);
    wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new Vector4(0, 0, 1, 1);

    const wheelMat = new StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png");

    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05, faceUV: wheelUV })
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

    // car position
    car.rotation.x = - Math.PI / 2
    car.rotation.y = -Math.PI / 2
    car.position.y = 0.1 + 0.1

    car.position.x = 3
    car.position.z = -8
    car.getChildMeshes().forEach((m: any) => {
      genShadow(m)
    })
    return car
  }

  const moveCar = (scene: Scene, car: Mesh) => {
    const animCar = new Animation('carAnimation', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKey = []
    carKey.push({
      frame: 0,
      value: -8,
    })
    carKey.push({
      frame: 150,
      value: 8,
    })
    carKey.push({
      frame: 151,
      value: 8,
    })
    animCar.setKeys(carKey)
    car.animations = []
    car.animations.push(animCar)
    scene.beginAnimation(car, 0, 210, true)
  }

  // 导入人物
  const genMan = (sence: Scene, shadowGen: any, camera: ArcRotateCamera) => {
    SceneLoader.ImportMeshAsync('him', '/scenes/', 'Dude.babylon', sence).then((result) => {
      const dude = result.meshes[0]
      dude.scaling = new Vector3(0.008, 0.008, 0.008)
      dude.position = new Vector3(-6, 0, 1)
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      const startRotation = dude.rotationQuaternion!.clone();

      sence.beginAnimation(result.skeletons[0], 0, 120, true, 1.0)

      const track = [
        { turn: 86, dist: 7 },
        { turn: -85, dist: 14.8 },
        { turn: -93, dist: 16.5 },
        { turn: 48, dist: 25.5 },
        { turn: -112, dist: 30.5 },
        { turn: -72, dist: 33.2 },
        { turn: 22, dist: 38 },
        { turn: 35, dist: 39 },
        { turn: -98, dist: 45.2 },
        { turn: 0, dist: 47 },
      ]

      let distance = 0
      const step = 0.015
      let p = 0
      sence.onBeforeRenderObservable.add(() => {
        dude.movePOV(0, 0, step)
        distance += step
        if (distance > track[p].dist) {
          dude.rotate(Axis.Y, track[p].turn * Math.PI / 180, Space.LOCAL)
          p += 1
          p %= track.length
          if (p === 0) {
            distance = 0
            dude.position = new Vector3(-6, 0, 1)
            dude.rotationQuaternion = startRotation.clone()
          }
        }
      })
      shadowGen(dude)
      camera.parent = dude
    })
  }

  // 路灯
  const genLamp = (scene: Scene) => {
    const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, scene);
    lampLight.diffuse = Color3.Yellow();

    const lampShape = [];
    for (let i = 0; i < 20; i++) {
      lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
    lampShape.push(lampShape[0]); //close shape

    //extrusion path
    const lampPath = [];
    lampPath.push(new Vector3(0, 0, 0));
    lampPath.push(new Vector3(0, 10, 0));
    for (let i = 0; i < 20; i++) {
      lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new Vector3(3, 11, 0));

    const yellowMat = new StandardMaterial("yellowMat");
    yellowMat.emissiveColor = Color3.Yellow();

    //extrude lamp
    const lamp = MeshBuilder.ExtrudeShape("lamp", { cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.3 });

    //add bulb
    const bulb = MeshBuilder.CreateSphere("bulb", { diameterX: 1.5, diameterZ: 0.8 });

    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

    lamp.scaling = new Vector3(0.15, 0.15, 0.15);
    lamp.position.x = 2

    const lamp_copy_1 = lamp.clone("lamp_copy_1");
    lamp_copy_1.position.z = 5
  }

  const genGUI = (light: HemisphericLight | DirectionalLight) => {
    const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const panel = new GUI.StackPanel();

    panel.width = "220px";
    panel.top = '-50px';
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    adt.addControl(panel);

    const header = new GUI.TextBlock();
    header.text = 'Night to Day'
    header.height = '30px'
    header.color = 'white'
    panel.addControl(header)

    const slider = new GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 1;
    slider.borderColor = 'black'
    slider.color = '#aaa'
    slider.background = '#fff'
    slider.value = 0.5
    slider.height = '20px'
    slider.width = '200px'
    panel.addControl(slider)

    slider.onValueChangedObservable.add((value) => {
      light.intensity = value
    })
  }

  useEffect(() => {
    if (!renderRef.current) {
      const engine = new Engine(ref.current, true)

      const scenne = createScene(engine)

      const camera = createCamera(scenne)

      const light = globalLight(scenne)

      const shadowGen = shadowControl(light)

      genGUI(light)

      genSky(scenne)

      genTrees(scenne)
      // genUfo(scenne)
      genFountain(scenne)
      genLamp(scenne)

      genGround(scenne)

      putHouses(scenne)

      const car = genCar(scenne, shadowGen)
      moveCar(scenne, car)
      genMan(scenne, shadowGen, camera)

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
