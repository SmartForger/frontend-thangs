import React, {Suspense, useRef, useState, useCallback} from 'react';
import {Canvas, useFrame, useLoader, useThree, extend} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


const Viewer = ({url,height="100%", width="100%"}) => {

  return (
    <Canvas style={{height:height, width:width, boxShadow: "inset 0 0 0 5px black", background: "#D9D9D9"}}>
      <ambientLight intensity={0.9} />
      <pointLight intensity={1.12} position={[-1, 2, 1]} />
      <Suspense fallback={<HoverCube />}>
        <Asset url={url}/>
      </Suspense>
      <Controls />
    </Canvas>
  )
}

function HoverCube({position}) {
  const mesh = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setActive] = useState(false);
  const [time, setTime] = useState(0);

  const color = isActive ? 0xf95b3c : 0xF7BB3D;

  const onHover = useCallback((e,value) => {
    e.stopPropagation();
    setIsHovered(value);
  }, [setIsHovered])

  const onClick = useCallback((e) => {
    e.stopPropagation();
    setActive(v => !v);
  }, [setActive]);

  useFrame( ({gl,scene,camera}) => {
    mesh.current.rotation.y += 0.02;
    setTime (time+ 0.03);
    if (mesh.current) { // a ref is needed because useFrame creates a "closure" on the state
      mesh.current.position.y = Math.sin(time) * 0.4;
    }
  })

  return (
  <mesh 
  ref={mesh}
  position={position || [0,0,0]}
  onClick={e => onClick(e)}
  onPointerOver={e => onHover(e, true)}
  onPointerOut={e => onHover(e, false)}>
    <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
    <meshStandardMaterial color={color} attach="material" />
  </mesh>)
}
  
extend({OrbitControls});
function Controls() {
  const controlsRef = useRef();
  const {camera, gl} = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableRotate
      enablePan={true}
      maxDistance={100}
      minDistance={5}
      minPolarAngle={Math.PI / 10}
      maxPolarAngle={Math.PI / 1}
    />
  );
}

function Asset({url}) {
  const [time, setTime] = useState(0);
  const mesh = useRef();
  const gltf = useLoader(GLTFLoader, url);

  useFrame(() => {
    setTime (time+ 0.03);
    if (mesh.current) {
      mesh.current.position.y = Math.sin(time) * 0.4;
    }
  })
  return (
    <primitive object={gltf.scene} />
  )
}

export {Viewer}