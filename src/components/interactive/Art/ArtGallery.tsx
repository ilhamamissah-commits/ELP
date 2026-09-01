import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ArtGallery: React.FC = () => {
  // In a real app, these would be saved pieces of art
  const [artworks, setArtworks] = useState<string[]>([]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h2 className="text-2xl font-bold text-white mb-2">🖼️ Art Gallery</h2>
      <p className="text-gray-400 text-sm mb-6">Showcase your amazing artwork!</p>

      {artworks.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-gray-500">No artwork yet!<br />Go create something amazing in the Drawing Canvas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {artworks.map((art, index) => (
            <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-lg overflow-hidden aspect-square">
              <img src={art} alt="Artwork" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};