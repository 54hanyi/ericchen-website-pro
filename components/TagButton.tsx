'use client';

interface TagButtonProps {
  tag: string;
  selected: boolean;
  onClick: () => void;
}

export default function TagButton({ tag, selected, onClick }: TagButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        selected
          ? 'bg-cyan-400 text-black border-cyan-400'
          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-cyan-900 hover:text-cyan-300'
      }`}
    >
      {tag}
    </button>
  );
}
