import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ViewCubeProps {
  onViewChange: (position: [number, number, number], target: [number, number, number]) => void;
}

export default function ViewCube({ onViewChange }: ViewCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(120, 120);
    renderer.setClearColor(0x000000, 0);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const cubeGroup = new THREE.Group();
    cubeRef.current = cubeGroup;

    const cubeGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.9 }),
    ];

    const cube = new THREE.Mesh(cubeGeometry, materials);
    cubeGroup.add(cube);
    cubeGroup.add(wireframe);

    const createLabel = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 128;
      canvas.height = 128;

      context.fillStyle = '#ffffff';
      context.font = 'bold 80px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.8, 0.8, 1);

      return sprite;
    };

    cubeGroup.add(createLabel('F', new THREE.Vector3(0, 0, 1.0)));
    cubeGroup.add(createLabel('B', new THREE.Vector3(0, 0, -1.0)));
    cubeGroup.add(createLabel('L', new THREE.Vector3(-1.0, 0, 0)));
    cubeGroup.add(createLabel('R', new THREE.Vector3(1.0, 0, 0)));
    cubeGroup.add(createLabel('T', new THREE.Vector3(0, 1.0, 0)));
    cubeGroup.add(createLabel('B', new THREE.Vector3(0, -1.0, 0)));

    scene.add(cubeGroup);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const cube = cubeRef.current?.children[0];
    if (!cube) return;

    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
      const face = intersects[0].face;
      if (!face) return;

      const normal = face.normal;
      const distance = 10;

      const position: [number, number, number] = [
        normal.x * distance,
        normal.y * distance,
        normal.z * distance
      ];

      onViewChange(position, [0, 0, 0]);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="cursor-pointer"
        style={{ display: 'block' }}
      />
    </div>
  );
}
