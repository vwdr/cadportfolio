import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ViewCube from './ViewCube';

interface CADViewerProps {
  fileUrl: string;
  fileType: 'stl' | 'gltf' | 'step';
}

function CameraController({ position, target }: { position: [number, number, number] | null; target: [number, number, number] | null }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (position && target && controlsRef.current) {
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...position);
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, endPos, eased);
        controlsRef.current.target.set(...target);
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [position, target, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      minDistance={1}
      maxDistance={50}
    />
  );
}

function Model({ fileUrl, fileType }: CADViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (fileType === 'step') {
      console.warn('STEP files require server-side conversion. Please convert to STL or GLTF.');
    }
  }, [fileType]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6b6b" wireframe />
      </mesh>
    );
  }

  if (fileType === 'stl') {
    try {
      const geometry = useLoader(STLLoader, fileUrl, undefined, () => {
        setError(true);
      });

      return (
        <mesh ref={meshRef} geometry={geometry}>
          <meshStandardMaterial
            color="#808080"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      );
    } catch (err) {
      console.error('Error loading STL:', err);
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff6b6b" wireframe />
        </mesh>
      );
    }
  }

  if (fileType === 'gltf') {
    try {
      const gltf = useLoader(GLTFLoader, fileUrl, undefined, () => {
        setError(true);
      });

      return <primitive object={gltf.scene} />;
    } catch (err) {
      console.error('Error loading GLTF:', err);
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff6b6b" wireframe />
        </mesh>
      );
    }
  }

  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff6b6b" wireframe />
    </mesh>
  );
}

export default function CADViewer({ fileUrl, fileType }: CADViewerProps) {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number] | null>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);

  const handleViewChange = (position: [number, number, number], target: [number, number, number]) => {
    setCameraPosition(position);
    setCameraTarget(target);
  };

  return (
    <div className="w-full h-full relative">
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

        <CameraController position={cameraPosition} target={cameraTarget} />
      </Canvas>

      <ViewCube onViewChange={handleViewChange} />
    </div>
  );
}
