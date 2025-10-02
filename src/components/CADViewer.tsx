import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CADViewerProps {
  fileUrl: string;
  fileType: 'stl' | 'gltf' | 'step';
}

function Model({ fileUrl, fileType }: CADViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (fileType === 'step') {
      console.warn('STEP files require server-side conversion. Please convert to STL or GLTF.');
    }
  }, [fileType]);

  if (fileType === 'stl') {
    const geometry = useLoader(STLLoader, fileUrl);

    return (
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#808080"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    );
  }

  if (fileType === 'gltf') {
    const gltf = useLoader(GLTFLoader, fileUrl);

    return <primitive object={gltf.scene} />;
  }

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  );
}

export default function CADViewer({ fileUrl, fileType }: CADViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000000']} />

        <Stage
          intensity={0.5}
          environment="city"
          shadows={{ type: 'accumulative', bias: -0.001 }}
          adjustCamera={1.5}
        >
          <Model fileUrl={fileUrl} fileType={fileType} />
        </Stage>

        <Environment preset="studio" />

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}
