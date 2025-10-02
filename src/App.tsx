import { useState, Suspense } from 'react';
import CADViewer from './components/CADViewer';
import ProjectSlider from './components/ProjectSlider';

interface Project {
  id: number;
  name: string;
  fileUrl: string;
  fileType: 'stl' | 'gltf' | 'step';
}

// Sample CAD projects - Replace these URLs with your actual CAD file URLs
const sampleProjects: Project[] = [
  {
    id: 1,
    name: 'Mechanical Part',
    fileUrl: 'https://threejs.org/examples/models/stl/binary/pr2_head_pan.stl',
    fileType: 'stl',
  },
  {
    id: 2,
    name: 'Robot Component',
    fileUrl: 'https://threejs.org/examples/models/stl/binary/pr2_head_tilt.stl',
    fileType: 'stl',
  },
  {
    id: 3,
    name: 'Helmet Design',
    fileUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    fileType: 'gltf',
  },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="text-white mt-4 text-lg">Loading 3D Model...</p>
      </div>
    </div>
  );
}

function App() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const currentProject = sampleProjects[currentProjectIndex];

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-6 px-8 border-b border-white/10">
        <h1 className="text-4xl font-bold text-white text-center tracking-tight">
          CAD Projects
        </h1>
      </header>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Suspense fallback={<LoadingFallback />}>
          <CADViewer
            key={currentProject.id}
            fileUrl={currentProject.fileUrl}
            fileType={currentProject.fileType}
          />
        </Suspense>

        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">Controls:</p>
          <ul className="space-y-1 text-white/80">
            <li>• Left click + drag to rotate</li>
            <li>• Right click + drag to pan</li>
            <li>• Scroll to zoom</li>
          </ul>
        </div>
      </div>

      {/* Project Slider */}
      <div className="border-t border-white/10">
        <ProjectSlider
          projects={sampleProjects}
          currentIndex={currentProjectIndex}
          onProjectChange={setCurrentProjectIndex}
        />
      </div>
    </div>
  );
}

export default App;
