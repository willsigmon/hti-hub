'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useHubby } from "@/contexts/HubbyContext";

export function Hubby() {
  const { pose, message, isVisible, setPose, setMessage } = useHubby();

  // Map poses to file paths
  const getPoseImage = (poseName: string) => `/poses/hubby-${poseName}.png`;

  // Handle hover interactions
  const handleMouseEnter = () => {
    if (pose === 'sitting' || pose === 'stand') {
      setPose('wave');
    }
  };

  const handleMouseLeave = () => {
    if (pose === 'wave') {
      setPose('stand');
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="mb-3 mr-4 glass-panel text-white p-4 rounded-2xl rounded-br-none shadow-2xl max-w-xs pointer-events-auto"
          >
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hubby Character */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 1, -1, 0]
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-28 h-28 cursor-pointer pointer-events-auto drop-shadow-[0_0_20px_rgba(246,123,22,0.5)] hover:drop-shadow-[0_0_30px_rgba(246,123,22,0.7)] transition-all duration-300"
        onClick={() => {
          setPose('happy_jump');
          setMessage("I'm here to help! Click me anytime.");
          setTimeout(() => {
            setPose('stand');
            setMessage(null);
          }, 3000);
        }}
      >
        <motion.img
          key={pose}
          src={getPoseImage(pose)}
          alt={`Hubby ${pose}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

export default Hubby;
