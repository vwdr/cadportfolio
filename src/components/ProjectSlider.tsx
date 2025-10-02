import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  fileUrl: string;
  fileType: 'stl' | 'gltf' | 'step';
}

interface ProjectSliderProps {
  projects: Project[];
  currentIndex: number;
  onProjectChange: (index: number) => void;
}

export default function ProjectSlider({
  projects,
  currentIndex,
  onProjectChange
}: ProjectSliderProps) {

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onProjectChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      onProjectChange(currentIndex + 1);
    }
  };

  return (
    <div className="w-full px-8 py-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex-1 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / projects.length) * 100}%`
                }}
              />
            </div>

            <div className="text-white text-sm font-medium min-w-[60px] text-right">
              {currentIndex + 1} / {projects.length}
            </div>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-white text-xl font-semibold">
              {projects[currentIndex]?.name}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              {projects[currentIndex]?.fileType.toUpperCase()} Format
            </p>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === projects.length - 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next project"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => onProjectChange(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
