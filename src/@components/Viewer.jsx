import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';

import * as THREE from 'three';
import { useStl } from '@customHooks';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Viewer = ({
    url,
    height = 'calc( 100% - 80px )',
    width = '100%',
    mode,
    meshColor,
    wireFrameColor,
    boxShadow = 'inset 0 0 0 5px black',
}) => {
    return (
        <Canvas
            orthographic="true"
            style={{
                height: height,
                width: width,
                boxShadow,
                background: '#ffffff',
                borderRadius: '8px 8px 0 0',
            }}
        >
            <ambientLight intensity={0.9} />
            <pointLight intensity={1.12} position={[-1, 2, 1]} />
            <Asset
                url={url}
                mode={mode}
                meshColor={meshColor}
                wireFrameColor={wireFrameColor}
            />
            <Controls />
        </Canvas>
    );
};

function HoverCube({ position }) {
    const mesh = useRef();
    const [, setIsHovered] = useState(false);
    const [isActive, setActive] = useState(false);
    const [time, setTime] = useState(0);

    const color = isActive ? 0xf95b3c : 0xf7bb3d;

    const onHover = useCallback(
        (e, value) => {
            e.stopPropagation();
            setIsHovered(value);
        },
        [setIsHovered]
    );

    const onClick = useCallback(
        e => {
            e.stopPropagation();
            setActive(v => !v);
        },
        [setActive]
    );

    useFrame(({ gl, scene, camera }) => {
        mesh.current.rotation.y += 0.02;
        setTime(time + 0.03);
        if (mesh.current) {
            // a ref is needed because useFrame creates a "closure" on the state
            mesh.current.position.y = Math.sin(time) * 0.4;
        }
    });

    return (
        <mesh
            ref={mesh}
            position={position || [0, 0, 0]}
            onClick={e => onClick(e)}
            onPointerOver={e => onHover(e, true)}
            onPointerOut={e => onHover(e, false)}
        >
            <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
            <meshStandardMaterial color={color} attach="material" />
        </mesh>
    );
}

extend({ OrbitControls });
function Controls() {
    const controlsRef = useRef();
    const { camera, gl } = useThree();

    useFrame(() => controlsRef.current && controlsRef.current.update());

    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableRotate
            enablePan={true}
            maxDistance={900}
            minDistance={300}
            minPolarAngle={Math.PI / 10}
            maxPolarAngle={Math.PI / 1}
        />
    );
}

const Asset = ({ url, mode, meshColor, wireFrameColor }) => {
    const [stl, loading, error] = useStl(url);
    const scene = new THREE.Scene();

    if (stl && !error && !loading) {
        const shadedMat = new THREE.MeshStandardMaterial({ color: meshColor });
        const wireframeMat = new THREE.MeshBasicMaterial({ wireframe: true });
        wireframeMat.color.set(wireFrameColor);
        const compositeMat = new THREE.MeshPhongMaterial({
            color: meshColor,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
        });
        let currentMat;

        switch (mode) {
            case 'wireframe':
                currentMat = wireframeMat;
                break;

            case 'composite':
                currentMat = compositeMat;
                break;

            default:
                currentMat = shadedMat;
        }

        const stlMesh = new THREE.Mesh(stl, currentMat);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        scene.add(directionalLight);
        scene.add(stlMesh);

        // Start Centering ///////////////////
        const center = new THREE.Vector3();
        stlMesh.geometry.computeBoundingBox();
        stlMesh.geometry.boundingBox.getCenter(center);
        stlMesh.geometry.center();
        stlMesh.position.copy(center);
        ///////////////////// End Centering //

        if (mode === 'composite') {
            var geo = new THREE.EdgesGeometry(stlMesh.geometry); // or WireframeGeometry
            var mat = new THREE.LineBasicMaterial({
                color: wireFrameColor,
                linewidth: 2,
            });
            var wireframeCover = new THREE.LineSegments(geo, mat);
            stlMesh.add(wireframeCover);
        }

        return <primitive object={scene} />;
    }

    return <HoverCube />;
};

export { Viewer };
