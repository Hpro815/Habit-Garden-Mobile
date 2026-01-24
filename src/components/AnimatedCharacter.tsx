import { motion } from 'framer-motion';
import type { ThemeType } from '@/types/habit';
import { Sparkles, Leaf } from 'lucide-react';

interface AnimatedCharacterProps {
  theme: ThemeType;
  stage: number; // 0-7
  colorPalette: string;
  isAnimating?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { container: 60, icon: 24 },
  medium: { container: 90, icon: 36 },
  large: { container: 150, icon: 60 },
};

// Realistic flower colors
const roseColors = {
  petals: '#E11D48', // Rose red
  petalsDark: '#BE123C',
  petalsLight: '#FB7185',
  stem: '#166534',
  stemDark: '#14532D',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
  center: '#FCD34D',
};

const lilyColors = {
  petals: '#FFFFFF',
  petalsDark: '#F3F4F6',
  petalsLight: '#FAFAFA',
  stem: '#166534',
  stemDark: '#14532D',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
  center: '#F59E0B',
  spots: '#F97316',
};

const tulipColors = {
  petals: '#EC4899', // Pink
  petalsDark: '#DB2777',
  petalsLight: '#F472B6',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
};

const carnationColors = {
  petals: '#F43F5E', // Rose red/pink
  petalsDark: '#E11D48',
  petalsLight: '#FB7185',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
};

const peonyColors = {
  petals: '#FDA4AF', // Light pink
  petalsDark: '#FB7185',
  petalsLight: '#FECDD3',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
  center: '#FCD34D',
};

const poppyColors = {
  petals: '#EF4444', // Red
  petalsDark: '#DC2626',
  petalsLight: '#F87171',
  stem: '#166534',
  leaves: '#22C55E',
  center: '#1F2937', // Dark center
};

const sunflowerColors = {
  petals: '#FCD34D', // Yellow
  petalsDark: '#FBBF24',
  petalsLight: '#FDE68A',
  stem: '#166534',
  stemDark: '#14532D',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
  center: '#78350F', // Brown center
  centerDark: '#451A03',
};

const irisColors = {
  petals: '#8B5CF6', // Purple
  petalsDark: '#7C3AED',
  petalsLight: '#A78BFA',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
  beard: '#FCD34D', // Yellow beard
};

const lavenderColors = {
  petals: '#A78BFA', // Light purple
  petalsDark: '#8B5CF6',
  petalsLight: '#C4B5FD',
  stem: '#166534',
  leaves: '#86EFAC', // Silvery green
  leavesDark: '#4ADE80',
};

const lilyOfValleyColors = {
  bells: '#FFFFFF',
  bellsDark: '#F3F4F6',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
};

const bluebellColors = {
  petals: '#3B82F6', // Blue
  petalsDark: '#2563EB',
  petalsLight: '#60A5FA',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
};

const buttercupColors = {
  petals: '#FACC15', // Bright yellow
  petalsDark: '#EAB308',
  petalsLight: '#FDE047',
  stem: '#166534',
  leaves: '#22C55E',
  center: '#CA8A04',
};

const cornflowerColors = {
  petals: '#6366F1', // Indigo blue
  petalsDark: '#4F46E5',
  petalsLight: '#818CF8',
  stem: '#166534',
  leaves: '#22C55E',
  leavesDark: '#16A34A',
};

// Generic plant (kept for backward compatibility)
function PlantCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.05);

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Soil/pot base */}
      <div className="absolute bottom-0 w-3/4 h-1/4 rounded-b-full bg-amber-800/40" />

      {/* Plant stem and leaves */}
      <div className="relative z-10 flex flex-col items-center justify-end" style={{ height: `${60 + stage * 5}%` }}>
        {/* Leaves - more as it grows */}
        {stage >= 1 && (
          <>
            <Leaf className="absolute left-0" size={dimensions.icon * 0.3 * scale} style={{ color: '#22C55E', top: '30%' }} />
            <Leaf className="absolute right-0" size={dimensions.icon * 0.3 * scale} style={{ color: '#22C55E', top: '50%', transform: 'scaleX(-1)' }} />
          </>
        )}
        {stage >= 3 && (
          <>
            <Leaf className="absolute left-0" size={dimensions.icon * 0.4 * scale} style={{ color: '#16A34A', top: '10%' }} />
            <Leaf className="absolute right-0" size={dimensions.icon * 0.4 * scale} style={{ color: '#16A34A', top: '20%', transform: 'scaleX(-1)' }} />
          </>
        )}

        {/* Flower/bloom at higher stages */}
        {stage >= 5 && (
          <div className="absolute -top-4">
            {[...Array(stage >= 7 ? 8 : 6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: dimensions.icon * 0.15,
                  height: dimensions.icon * 0.15,
                  backgroundColor: '#FDE68A',
                  border: '2px solid #F59E0B',
                  transform: `rotate(${i * (360 / (stage >= 7 ? 8 : 6))}deg) translateY(-${dimensions.icon * 0.15}px)`,
                }}
              />
            ))}
            <div
              className="rounded-full"
              style={{
                width: dimensions.icon * 0.2,
                height: dimensions.icon * 0.2,
                backgroundColor: '#F59E0B',
                position: 'relative',
                zIndex: 10,
              }}
            />
          </div>
        )}

        {/* Main stem */}
        <div
          className="rounded-t-full"
          style={{
            width: Math.max(4, dimensions.icon * 0.1 * scale),
            height: `${100 * scale}%`,
            backgroundColor: '#166534',
          }}
        />
      </div>
    </div>
  );
}

// Realistic Rose character
function RoseCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.64 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #B45309, #92400E)',
          borderTop: '3px solid #78350F',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: roseColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Thorns on stem */}
      {stage >= 3 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.3,
              left: '50%',
              marginLeft: 3,
              width: 6,
              height: 3,
              backgroundColor: roseColors.stemDark,
              transform: 'rotate(45deg)',
              borderRadius: 1,
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.4,
              left: '50%',
              marginLeft: -9,
              width: 6,
              height: 3,
              backgroundColor: roseColors.stemDark,
              transform: 'rotate(-45deg)',
              borderRadius: 1,
            }}
          />
        </>
      )}

      {/* Leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.35,
              left: '50%',
              marginLeft: 5,
              width: 20 * scale,
              height: 12 * scale,
              backgroundColor: roseColors.leaves,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(20deg)',
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.35,
              left: '50%',
              marginLeft: -25 * scale,
              width: 20 * scale,
              height: 12 * scale,
              backgroundColor: roseColors.leaves,
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-20deg)',
              boxShadow: 'inset 2px -2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </>
      )}

      {/* Rose Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.6,
            height: flowerSize * 0.8,
            background: `linear-gradient(to top, ${roseColors.petals}, ${roseColors.petalsLight})`,
            borderRadius: '50% 50% 40% 40%',
            boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)',
          }}
        />
      )}

      {/* Full Rose Bloom (stages 6-7) */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Outer petals */}
          {[...Array(stage >= 7 ? 8 : 6)].map((_, i) => (
            <div
              key={`outer-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.5,
                height: flowerSize * 0.6,
                backgroundColor: roseColors.petals,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.25,
                marginTop: -flowerSize * 0.3,
                transform: `rotate(${i * (360 / (stage >= 7 ? 8 : 6))}deg) translateY(-${flowerSize * 0.3}px)`,
                boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.15)',
              }}
            />
          ))}
          {/* Inner petals */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`inner-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.35,
                height: flowerSize * 0.4,
                backgroundColor: roseColors.petalsLight,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.175,
                marginTop: -flowerSize * 0.2,
                transform: `rotate(${i * 72 + 36}deg) translateY(-${flowerSize * 0.15}px)`,
                boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)',
              }}
            />
          ))}
          {/* Center */}
          <div
            className="absolute rounded-full"
            style={{
              width: flowerSize * 0.25,
              height: flowerSize * 0.25,
              backgroundColor: roseColors.center,
              left: '50%',
              top: '50%',
              marginLeft: -flowerSize * 0.125,
              marginTop: -flowerSize * 0.125,
            }}
          />
        </div>
      )}

      {/* Seed stage (0-1) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 8,
            height: 6,
            backgroundColor: '#78350F',
          }}
        />
      )}

      {/* Sprout (stage 1) */}
      {stage === 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - 8,
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `12px solid ${roseColors.leaves}`,
          }}
        />
      )}
    </div>
  );
}

// Realistic Lily character
function LilyCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #7C3AED, #6D28D9)',
          borderTop: '3px solid #5B21B6',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 3 + stage * 0.4,
            height: stemHeight,
            backgroundColor: lilyColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Long lily leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: 2,
              width: 8 * scale,
              height: 35 * scale,
              backgroundColor: lilyColors.leaves,
              borderRadius: '40% 40% 50% 50%',
              transform: 'rotate(25deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: -10 * scale,
              width: 8 * scale,
              height: 35 * scale,
              backgroundColor: lilyColors.leaves,
              borderRadius: '40% 40% 50% 50%',
              transform: 'rotate(-25deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {stage >= 4 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: 8,
              width: 6 * scale,
              height: 28 * scale,
              backgroundColor: lilyColors.leavesDark,
              borderRadius: '40% 40% 50% 50%',
              transform: 'rotate(40deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: -14 * scale,
              width: 6 * scale,
              height: 28 * scale,
              backgroundColor: lilyColors.leavesDark,
              borderRadius: '40% 40% 50% 50%',
              transform: 'rotate(-40deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Lily Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
          }}
        >
          <div
            style={{
              width: flowerSize * 0.4,
              height: flowerSize * 0.7,
              background: `linear-gradient(to top, ${lilyColors.leavesDark}, ${lilyColors.petals})`,
              borderRadius: '30% 30% 50% 50%',
            }}
          />
        </div>
      )}

      {/* Full Lily Bloom (stages 6-7) */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 15 : 0),
          }}
        >
          {/* Lily petals - 6 curved petals */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.3,
                height: flowerSize * 0.8,
                background: `linear-gradient(to top, ${lilyColors.petals}, ${lilyColors.petalsDark})`,
                borderRadius: '50% 50% 50% 50%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.15,
                marginTop: -flowerSize * 0.4,
                transform: `rotate(${i * 60}deg) translateY(-${flowerSize * 0.2}px)`,
                boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.05)',
              }}
            >
              {/* Orange spots on petals */}
              {stage >= 7 && (
                <>
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: lilyColors.spots,
                      top: '40%',
                      left: '30%',
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 2,
                      height: 2,
                      backgroundColor: lilyColors.spots,
                      top: '50%',
                      left: '50%',
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: lilyColors.spots,
                      top: '45%',
                      left: '65%',
                    }}
                  />
                </>
              )}
            </div>
          ))}
          {/* Stamen/center */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`stamen-${i}`}
              className="absolute"
              style={{
                width: 2,
                height: flowerSize * 0.3,
                backgroundColor: lilyColors.stem,
                left: '50%',
                top: '50%',
                marginLeft: -1,
                marginTop: -flowerSize * 0.15,
                transform: `rotate(${i * 60 + 30}deg) translateY(-${flowerSize * 0.08}px)`,
                borderRadius: 1,
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 4,
                  backgroundColor: lilyColors.center,
                  top: -2,
                  left: -1.5,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bulb stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 12,
            height: 10,
            backgroundColor: '#D4A574',
            borderRadius: '50% 50% 50% 50%',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
          }}
        />
      )}

      {/* Shoot (stage 1) */}
      {stage === 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - 5,
            width: 6,
            height: 10,
            backgroundColor: lilyColors.leaves,
            borderRadius: '50% 50% 30% 30%',
          }}
        />
      )}
    </div>
  );
}

// Tulip character
function TulipCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.64 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #EC4899, #DB2777)',
          borderTop: '3px solid #BE185D',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: tulipColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Long tulip leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: 3,
              width: 10 * scale,
              height: 40 * scale,
              backgroundColor: tulipColors.leaves,
              borderRadius: '30% 70% 50% 50%',
              transform: 'rotate(15deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: -13 * scale,
              width: 10 * scale,
              height: 40 * scale,
              backgroundColor: tulipColors.leaves,
              borderRadius: '70% 30% 50% 50%',
              transform: 'rotate(-15deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Tulip Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.5,
            height: flowerSize * 0.8,
            background: `linear-gradient(to top, ${tulipColors.petals}, ${tulipColors.petalsLight})`,
            borderRadius: '50% 50% 30% 30%',
          }}
        />
      )}

      {/* Full Tulip Bloom (stages 6-7) */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Tulip petals - 6 curved petals in cup shape */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.35,
                height: flowerSize * 0.7,
                background: `linear-gradient(to top, ${tulipColors.petalsDark}, ${tulipColors.petals}, ${tulipColors.petalsLight})`,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.175,
                marginTop: -flowerSize * 0.35,
                transform: `rotate(${i * 60}deg) translateY(-${flowerSize * 0.15}px)`,
                boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>
      )}

      {/* Bulb stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.22,
            width: 12,
            height: 10,
            backgroundColor: '#D4A574',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
}

// Carnation character
function CarnationCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #F43F5E, #E11D48)',
          borderTop: '3px solid #BE123C',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: carnationColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Narrow leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.3,
              left: '50%',
              marginLeft: 4,
              width: 6 * scale,
              height: 25 * scale,
              backgroundColor: carnationColors.leaves,
              borderRadius: '30% 70% 50% 50%',
              transform: 'rotate(30deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.3,
              left: '50%',
              marginLeft: -10 * scale,
              width: 6 * scale,
              height: 25 * scale,
              backgroundColor: carnationColors.leaves,
              borderRadius: '70% 30% 50% 50%',
              transform: 'rotate(-30deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Carnation Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.4,
            height: flowerSize * 0.6,
            background: `linear-gradient(to top, ${carnationColors.stem}, ${carnationColors.petals})`,
            borderRadius: '50% 50% 30% 30%',
          }}
        />
      )}

      {/* Full Carnation Bloom (stages 6-7) - ruffled petals */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Multiple layers of ruffled petals */}
          {[...Array(stage >= 7 ? 12 : 8)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.3,
                height: flowerSize * 0.35,
                backgroundColor: i % 2 === 0 ? carnationColors.petals : carnationColors.petalsLight,
                borderRadius: '50% 50% 20% 20%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.15,
                marginTop: -flowerSize * 0.175,
                transform: `rotate(${i * (360 / (stage >= 7 ? 12 : 8))}deg) translateY(-${flowerSize * 0.2}px)`,
                boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)',
                borderTop: `2px solid ${carnationColors.petalsDark}`,
              }}
            />
          ))}
          {/* Inner petals */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`inner-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.2,
                height: flowerSize * 0.25,
                backgroundColor: carnationColors.petalsLight,
                borderRadius: '50% 50% 20% 20%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.1,
                marginTop: -flowerSize * 0.125,
                transform: `rotate(${i * 60 + 30}deg) translateY(-${flowerSize * 0.08}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 6,
            height: 4,
            backgroundColor: '#78350F',
          }}
        />
      )}
    </div>
  );
}

// Peony character
function PeonyCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #FDA4AF, #FB7185)',
          borderTop: '3px solid #F43F5E',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: peonyColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Compound leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: 5,
              width: 15 * scale,
              height: 20 * scale,
              backgroundColor: peonyColors.leaves,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(20deg)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: -20 * scale,
              width: 15 * scale,
              height: 20 * scale,
              backgroundColor: peonyColors.leaves,
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-20deg)',
            }}
          />
        </>
      )}

      {/* Peony Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.5,
            height: flowerSize * 0.6,
            background: `linear-gradient(to top, ${peonyColors.stem}, ${peonyColors.petals})`,
            borderRadius: '50% 50% 40% 40%',
          }}
        />
      )}

      {/* Full Peony Bloom (stages 6-7) - lush, layered petals */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Outer layer petals */}
          {[...Array(stage >= 7 ? 10 : 8)].map((_, i) => (
            <div
              key={`outer-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.4,
                height: flowerSize * 0.5,
                backgroundColor: peonyColors.petals,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.2,
                marginTop: -flowerSize * 0.25,
                transform: `rotate(${i * (360 / (stage >= 7 ? 10 : 8))}deg) translateY(-${flowerSize * 0.25}px)`,
                boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.1)',
              }}
            />
          ))}
          {/* Middle layer */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`middle-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.3,
                height: flowerSize * 0.35,
                backgroundColor: peonyColors.petalsLight,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.15,
                marginTop: -flowerSize * 0.175,
                transform: `rotate(${i * 45 + 22.5}deg) translateY(-${flowerSize * 0.15}px)`,
              }}
            />
          ))}
          {/* Center */}
          <div
            className="absolute rounded-full"
            style={{
              width: flowerSize * 0.2,
              height: flowerSize * 0.2,
              backgroundColor: peonyColors.center,
              left: '50%',
              top: '50%',
              marginLeft: -flowerSize * 0.1,
              marginTop: -flowerSize * 0.1,
            }}
          />
        </div>
      )}

      {/* Root stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 14,
            height: 8,
            backgroundColor: '#92400E',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
}

// Poppy character
function PoppyCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #EF4444, #DC2626)',
          borderTop: '3px solid #B91C1C',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Thin hairy stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: '#166534',
            borderRadius: 2,
          }}
        />
      )}

      {/* Feathery leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: 3,
              width: 18 * scale,
              height: 12 * scale,
              backgroundColor: poppyColors.leaves,
              borderRadius: '20% 80% 80% 20%',
              transform: 'rotate(10deg)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: -21 * scale,
              width: 18 * scale,
              height: 12 * scale,
              backgroundColor: poppyColors.leaves,
              borderRadius: '80% 20% 20% 80%',
              transform: 'rotate(-10deg)',
            }}
          />
        </>
      )}

      {/* Poppy Bud - drooping (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.35,
            height: flowerSize * 0.5,
            background: `linear-gradient(to top, ${poppyColors.leaves}, ${poppyColors.petals})`,
            borderRadius: '40% 40% 50% 50%',
            transform: 'rotate(15deg)',
          }}
        />
      )}

      {/* Full Poppy Bloom (stages 6-7) - 4 delicate petals */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 12 : 0),
          }}
        >
          {/* 4 tissue-paper-like petals */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.5,
                height: flowerSize * 0.55,
                background: `radial-gradient(ellipse at bottom, ${poppyColors.petalsDark}, ${poppyColors.petals})`,
                borderRadius: '50% 50% 45% 45%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.25,
                marginTop: -flowerSize * 0.275,
                transform: `rotate(${i * 90 + 45}deg) translateY(-${flowerSize * 0.2}px)`,
                boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.15)',
              }}
            />
          ))}
          {/* Dark center */}
          <div
            className="absolute rounded-full"
            style={{
              width: flowerSize * 0.25,
              height: flowerSize * 0.25,
              backgroundColor: poppyColors.center,
              left: '50%',
              top: '50%',
              marginLeft: -flowerSize * 0.125,
              marginTop: -flowerSize * 0.125,
            }}
          />
        </div>
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 5,
            height: 4,
            backgroundColor: '#1F2937',
          }}
        />
      )}
    </div>
  );
}

// Sunflower character (Premium)
function SunflowerCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #FBBF24, #F59E0B)',
          borderTop: '3px solid #D97706',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Thick stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 3 + stage * 0.4,
            height: stemHeight,
            backgroundColor: sunflowerColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Large heart-shaped leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.3,
              left: '50%',
              marginLeft: 6,
              width: 22 * scale,
              height: 18 * scale,
              backgroundColor: sunflowerColors.leaves,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(25deg)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.3,
              left: '50%',
              marginLeft: -28 * scale,
              width: 22 * scale,
              height: 18 * scale,
              backgroundColor: sunflowerColors.leaves,
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-25deg)',
            }}
          />
        </>
      )}

      {stage >= 4 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.4,
              left: '50%',
              marginLeft: 8,
              width: 18 * scale,
              height: 15 * scale,
              backgroundColor: sunflowerColors.leavesDark,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(35deg)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.4,
              left: '50%',
              marginLeft: -26 * scale,
              width: 18 * scale,
              height: 15 * scale,
              backgroundColor: sunflowerColors.leavesDark,
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-35deg)',
            }}
          />
        </>
      )}

      {/* Sunflower Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.5,
            height: flowerSize * 0.6,
            background: `linear-gradient(to top, ${sunflowerColors.stem}, ${sunflowerColors.petals})`,
            borderRadius: '50% 50% 40% 40%',
          }}
        />
      )}

      {/* Full Sunflower Bloom (stages 6-7) */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Yellow petals radiating out */}
          {[...Array(stage >= 7 ? 16 : 12)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.2,
                height: flowerSize * 0.5,
                background: `linear-gradient(to top, ${sunflowerColors.petalsDark}, ${sunflowerColors.petals})`,
                borderRadius: '30% 30% 50% 50%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.1,
                marginTop: -flowerSize * 0.25,
                transform: `rotate(${i * (360 / (stage >= 7 ? 16 : 12))}deg) translateY(-${flowerSize * 0.35}px)`,
              }}
            />
          ))}
          {/* Brown center with seeds pattern */}
          <div
            className="absolute rounded-full"
            style={{
              width: flowerSize * 0.45,
              height: flowerSize * 0.45,
              background: `radial-gradient(circle, ${sunflowerColors.center}, ${sunflowerColors.centerDark})`,
              left: '50%',
              top: '50%',
              marginLeft: -flowerSize * 0.225,
              marginTop: -flowerSize * 0.225,
            }}
          >
            {/* Seed dots */}
            {stage >= 7 && [...Array(8)].map((_, i) => (
              <div
                key={`seed-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: sunflowerColors.centerDark,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-${flowerSize * 0.1}px)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.22,
            width: 10,
            height: 6,
            backgroundColor: '#1F2937',
            borderRadius: '30% 30% 50% 50%',
          }}
        />
      )}
    </div>
  );
}

// Iris character (Premium)
function IrisCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;
  const flowerSize = dimensions.icon * 0.67 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #8B5CF6, #7C3AED)',
          borderTop: '3px solid #6D28D9',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 4 + stage * 0.5,
            height: stemHeight,
            backgroundColor: irisColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Sword-like leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: 2,
              width: 8 * scale,
              height: 45 * scale,
              backgroundColor: irisColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: 'rotate(8deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: -10 * scale,
              width: 8 * scale,
              height: 45 * scale,
              backgroundColor: irisColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: 'rotate(-8deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Iris Bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.35,
            height: flowerSize * 0.6,
            background: `linear-gradient(to top, ${irisColors.stem}, ${irisColors.petals})`,
            borderRadius: '30% 30% 50% 50%',
          }}
        />
      )}

      {/* Full Iris Bloom (stages 6-7) - standards and falls */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
          }}
        >
          {/* Falls (drooping petals) */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`fall-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.35,
                height: flowerSize * 0.55,
                background: `linear-gradient(to bottom, ${irisColors.petals}, ${irisColors.petalsDark})`,
                borderRadius: '50% 50% 60% 60%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.175,
                marginTop: -flowerSize * 0.1,
                transform: `rotate(${i * 120}deg) translateY(${flowerSize * 0.15}px)`,
              }}
            >
              {/* Yellow beard */}
              <div
                className="absolute"
                style={{
                  width: flowerSize * 0.15,
                  height: flowerSize * 0.1,
                  backgroundColor: irisColors.beard,
                  borderRadius: '50%',
                  top: '20%',
                  left: '50%',
                  marginLeft: -flowerSize * 0.075,
                }}
              />
            </div>
          ))}
          {/* Standards (upright petals) */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`standard-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.3,
                height: flowerSize * 0.5,
                background: `linear-gradient(to top, ${irisColors.petalsDark}, ${irisColors.petalsLight})`,
                borderRadius: '50% 50% 40% 40%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.15,
                marginTop: -flowerSize * 0.35,
                transform: `rotate(${i * 120 + 60}deg) translateY(-${flowerSize * 0.15}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Rhizome stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 15,
            height: 8,
            backgroundColor: '#D4A574',
            borderRadius: '40% 40% 50% 50%',
          }}
        />
      )}
    </div>
  );
}

// Lavender character (Premium)
function LavenderCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.35 + (stage * 0.03);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #A78BFA, #8B5CF6)',
          borderTop: '3px solid #7C3AED',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Multiple thin stems with flowers */}
      {stage >= 1 && [...Array(stage >= 6 ? 5 : 3)].map((_, i) => {
        const stemSpacing = dimensions.container >= 140 ? 6 : 4;
        const offsetX = (i - (stage >= 6 ? 2 : 1)) * stemSpacing;
        const heightVar = stemHeight + (i % 2) * 3;
        return (
          <div key={`stem-${i}`}>
            <div
              className="absolute"
              style={{
                bottom: dimensions.container * 0.2,
                left: '50%',
                marginLeft: offsetX - 1,
                width: 2,
                height: heightVar,
                backgroundColor: lavenderColors.stem,
                borderRadius: 1,
              }}
            />
            {/* Flower spike on each stem */}
            {stage >= 4 && (
              <div
                className="absolute"
                style={{
                  bottom: dimensions.container * 0.2 + heightVar - 5,
                  left: '50%',
                  marginLeft: offsetX - 3,
                }}
              >
                {[...Array(stage >= 6 ? 4 : 3)].map((_, j) => (
                  <div
                    key={`flower-${i}-${j}`}
                    className="absolute rounded-full"
                    style={{
                      width: dimensions.container >= 140 ? 8 : 6,
                      height: dimensions.container >= 140 ? 5 : 4,
                      backgroundColor: j % 2 === 0 ? lavenderColors.petals : lavenderColors.petalsLight,
                      bottom: j * 4,
                      left: j % 2 === 0 ? -1 : 1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Silvery narrow leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: dimensions.container >= 140 ? 5 : 3,
              width: 4 * scale,
              height: (dimensions.container >= 140 ? 25 : 18) * scale,
              backgroundColor: lavenderColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: dimensions.container >= 140 ? 'rotate(20deg)' : 'rotate(15deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: dimensions.container >= 140 ? -9 * scale : -7 * scale,
              width: 4 * scale,
              height: (dimensions.container >= 140 ? 25 : 18) * scale,
              backgroundColor: lavenderColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: dimensions.container >= 140 ? 'rotate(-20deg)' : 'rotate(-15deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 5,
            height: 3,
            backgroundColor: '#4B5563',
          }}
        />
      )}
    </div>
  );
}

// Lily of the Valley character (Premium)
function LilyOfValleyCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.5 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 25 + stage * 3 : 12 + stage * 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
          borderTop: '3px solid #9CA3AF',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Arching stem - thinner */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            left: '50%',
            marginLeft: -1,
            width: 2,
            height: stemHeight,
            backgroundColor: lilyOfValleyColors.stem,
            borderRadius: 1,
            transform: 'rotate(-8deg)',
            transformOrigin: 'bottom center',
          }}
        />
      )}

      {/* Large broad leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: -24 * scale,
              width: 22 * scale,
              height: 50 * scale,
              backgroundColor: lilyOfValleyColors.leaves,
              borderRadius: '50% 50% 50% 50%',
              transform: 'rotate(-15deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: 2 * scale,
              width: 20 * scale,
              height: 45 * scale,
              backgroundColor: lilyOfValleyColors.leavesDark,
              borderRadius: '50% 50% 50% 50%',
              transform: 'rotate(10deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Bell-shaped flowers hanging down from stem - positioned ON the stem */}
      {stage >= 4 && (
        <>
          {[...Array(stage >= 6 ? 5 : 3)].map((_, i) => {
            // Position bells along the stem - moved left to be on the stem
            const bellHeight = dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0) - i * 7;
            const xOffset = -5 + (i % 2) * 2; // Moved left to align with stem
            return (
              <div
                key={`bell-${i}`}
                className="absolute"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: lilyOfValleyColors.bells,
                  borderRadius: '40% 40% 50% 50%',
                  left: '50%',
                  marginLeft: xOffset,
                  bottom: bellHeight,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  border: `1px solid ${lilyOfValleyColors.bellsDark}`,
                }}
              />
            );
          })}
        </>
      )}

      {/* Pip stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 10,
            height: 8,
            backgroundColor: '#FEF3C7',
            borderRadius: '50% 50% 40% 40%',
          }}
        />
      )}
    </div>
  );
}

// Bluebell character (Premium)
function BluebellCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.5 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 26 + stage * 3 : 14 + stage * 2;
  const flowerSize = dimensions.icon * 0.32 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #3B82F6, #2563EB)',
          borderTop: '3px solid #1D4ED8',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Arching stem - thinner */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2,
            height: stemHeight,
            backgroundColor: bluebellColors.stem,
            borderRadius: 1,
            transform: 'rotate(-8deg)',
            transformOrigin: 'bottom center',
          }}
        />
      )}

      {/* Narrow strap-like leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: 2,
              width: 8 * scale,
              height: 40 * scale,
              backgroundColor: bluebellColors.leaves,
              borderRadius: '30% 30% 50% 50%',
              transform: 'rotate(12deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.22,
              left: '50%',
              marginLeft: -10 * scale,
              width: 8 * scale,
              height: 40 * scale,
              backgroundColor: bluebellColors.leaves,
              borderRadius: '30% 30% 50% 50%',
              transform: 'rotate(-12deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Bell-shaped flowers hanging along the stem - moved left to be on stem */}
      {stage >= 4 && (
        <>
          {[...Array(stage >= 6 ? 5 : 3)].map((_, i) => {
            // Position bells along the stem - moved left to align with stem
            const bellHeight = dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0) - i * 6;
            const xOffset = -5 + (i % 2) * 2; // Moved left to align with stem
            return (
              <div
                key={`bell-${i}`}
                className="absolute"
                style={{
                  width: flowerSize * 1.0,
                  height: flowerSize * 1.2,
                  background: `linear-gradient(to bottom, ${bluebellColors.petalsLight}, ${bluebellColors.petals})`,
                  borderRadius: '40% 40% 60% 60%',
                  left: '50%',
                  marginLeft: xOffset,
                  bottom: bellHeight,
                  transform: `rotate(${i % 2 === 0 ? -10 : 10}deg)`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {/* Petal edges */}
                {stage >= 6 && (
                  <div
                    className="absolute"
                    style={{
                      bottom: 0,
                      left: '50%',
                      marginLeft: -flowerSize * 0.35,
                      width: flowerSize * 0.7,
                      height: 2,
                      backgroundColor: bluebellColors.petalsDark,
                      borderRadius: '0 0 50% 50%',
                    }}
                  />
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Bulb stage (0) */}
      {stage < 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 10,
            height: 8,
            backgroundColor: '#D4A574',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
}

// Buttercup character (Premium)
function ButtercupCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 22 + stage * 3 : 10 + stage * 2;
  const flowerSize = dimensions.icon * 0.60 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #FACC15, #EAB308)',
          borderTop: '3px solid #CA8A04',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Branching stems */}
      {stage >= 1 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.2,
              width: 2 + stage * 0.3,
              height: stemHeight,
              backgroundColor: buttercupColors.stem,
              borderRadius: 2,
            }}
          />
          {stage >= 4 && (
            <>
              <div
                className="absolute"
                style={{
                  bottom: dimensions.container * 0.2 + stemHeight * 0.6,
                  left: '50%',
                  marginLeft: 2,
                  width: 2,
                  height: stemHeight * 0.3,
                  backgroundColor: buttercupColors.stem,
                  borderRadius: 1,
                  transform: 'rotate(30deg)',
                  transformOrigin: 'bottom center',
                }}
              />
              <div
                className="absolute"
                style={{
                  bottom: dimensions.container * 0.2 + stemHeight * 0.6,
                  left: '50%',
                  marginLeft: -4,
                  width: 2,
                  height: stemHeight * 0.3,
                  backgroundColor: buttercupColors.stem,
                  borderRadius: 1,
                  transform: 'rotate(-30deg)',
                  transformOrigin: 'bottom center',
                }}
              />
            </>
          )}
        </>
      )}

      {/* Deeply divided leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: 5,
              width: 15 * scale,
              height: 12 * scale,
              backgroundColor: buttercupColors.leaves,
              borderRadius: '30% 70% 70% 30%',
              transform: 'rotate(15deg)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.28,
              left: '50%',
              marginLeft: -20 * scale,
              width: 15 * scale,
              height: 12 * scale,
              backgroundColor: buttercupColors.leaves,
              borderRadius: '70% 30% 30% 70%',
              transform: 'rotate(-15deg)',
            }}
          />
        </>
      )}

      {/* Buttercup flowers - glossy 5-petal */}
      {stage >= 6 && (
        <>
          {/* Main flower */}
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 10 : 0),
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={`petal-${i}`}
                className="absolute"
                style={{
                  width: flowerSize * 0.5,
                  height: flowerSize * 0.5,
                  background: `radial-gradient(ellipse at center, ${buttercupColors.petalsLight}, ${buttercupColors.petals})`,
                  borderRadius: '50%',
                  left: '50%',
                  top: '50%',
                  marginLeft: -flowerSize * 0.25,
                  marginTop: -flowerSize * 0.25,
                  transform: `rotate(${i * 72}deg) translateY(-${flowerSize * 0.25}px)`,
                  boxShadow: 'inset 0 0 5px rgba(255,255,255,0.5)',
                }}
              />
            ))}
            <div
              className="absolute rounded-full"
              style={{
                width: flowerSize * 0.25,
                height: flowerSize * 0.25,
                backgroundColor: buttercupColors.center,
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.125,
                marginTop: -flowerSize * 0.125,
              }}
            />
          </div>
          {/* Side flowers for stage 7 */}
          {stage >= 7 && (
            <>
              <div
                className="absolute"
                style={{
                  bottom: dimensions.container * 0.2 + stemHeight * 0.7,
                  left: '50%',
                  marginLeft: 12,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`petal2-${i}`}
                    className="absolute"
                    style={{
                      width: flowerSize * 0.35,
                      height: flowerSize * 0.35,
                      background: `radial-gradient(ellipse at center, ${buttercupColors.petalsLight}, ${buttercupColors.petals})`,
                      borderRadius: '50%',
                      left: '50%',
                      top: '50%',
                      marginLeft: -flowerSize * 0.175,
                      marginTop: -flowerSize * 0.175,
                      transform: `rotate(${i * 72}deg) translateY(-${flowerSize * 0.18}px)`,
                    }}
                  />
                ))}
              </div>
              <div
                className="absolute"
                style={{
                  bottom: dimensions.container * 0.2 + stemHeight * 0.7,
                  left: '50%',
                  marginLeft: -18,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`petal3-${i}`}
                    className="absolute"
                    style={{
                      width: flowerSize * 0.35,
                      height: flowerSize * 0.35,
                      background: `radial-gradient(ellipse at center, ${buttercupColors.petalsLight}, ${buttercupColors.petals})`,
                      borderRadius: '50%',
                      left: '50%',
                      top: '50%',
                      marginLeft: -flowerSize * 0.175,
                      marginTop: -flowerSize * 0.175,
                      transform: `rotate(${i * 72}deg) translateY(-${flowerSize * 0.18}px)`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Bud stage (4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.4,
            height: flowerSize * 0.4,
            background: `linear-gradient(to top, ${buttercupColors.stem}, ${buttercupColors.petals})`,
          }}
        />
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 5,
            height: 3,
            backgroundColor: '#713F12',
          }}
        />
      )}
    </div>
  );
}

// Cornflower character (Premium)
function CornflowerCharacter({ stage, dimensions }: { stage: number; dimensions: { container: number; icon: number } }) {
  const scale = 0.4 + (stage * 0.04);
  const stemHeight = dimensions.container >= 140 ? 22 + stage * 3 : 10 + stage * 2;
  const flowerSize = dimensions.icon * 0.64 * scale;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Pot */}
      <div
        className="absolute bottom-0 rounded-b-lg"
        style={{
          width: dimensions.container * 0.4,
          height: dimensions.container * 0.2,
          background: 'linear-gradient(to bottom, #6366F1, #4F46E5)',
          borderTop: '3px solid #4338CA',
          zIndex: 1,
        }}
      />

      {/* Soil - behind pot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: dimensions.container * 0.18,
          width: dimensions.container * 0.35,
          height: dimensions.container * 0.06,
          backgroundColor: '#451A03',
          zIndex: 0,
        }}
      />

      {/* Thin branching stem */}
      {stage >= 1 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2,
            width: 2 + stage * 0.3,
            height: stemHeight,
            backgroundColor: cornflowerColors.stem,
            borderRadius: 2,
          }}
        />
      )}

      {/* Narrow lance-shaped leaves */}
      {stage >= 2 && (
        <>
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: 3,
              width: 5 * scale,
              height: 28 * scale,
              backgroundColor: cornflowerColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: 'rotate(15deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: dimensions.container * 0.25,
              left: '50%',
              marginLeft: -8 * scale,
              width: 5 * scale,
              height: 28 * scale,
              backgroundColor: cornflowerColors.leaves,
              borderRadius: '20% 20% 50% 50%',
              transform: 'rotate(-15deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {/* Cornflower bud (stages 4-5) */}
      {stage >= 4 && stage < 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 5 : 0),
            width: flowerSize * 0.4,
            height: flowerSize * 0.5,
            background: `linear-gradient(to top, ${cornflowerColors.stem}, ${cornflowerColors.petals})`,
            borderRadius: '40% 40% 50% 50%',
          }}
        />
      )}

      {/* Full Cornflower Bloom (stages 6-7) - spiky ray florets */}
      {stage >= 6 && (
        <div
          className="absolute"
          style={{
            bottom: dimensions.container * 0.2 + stemHeight - (dimensions.container >= 140 ? 12 : 0),
          }}
        >
          {/* Outer spiky petals */}
          {[...Array(stage >= 7 ? 12 : 8)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                width: flowerSize * 0.15,
                height: flowerSize * 0.45,
                background: `linear-gradient(to top, ${cornflowerColors.petalsDark}, ${cornflowerColors.petals})`,
                borderRadius: '30% 30% 50% 50%',
                left: '50%',
                top: '50%',
                marginLeft: -flowerSize * 0.075,
                marginTop: -flowerSize * 0.225,
                transform: `rotate(${i * (360 / (stage >= 7 ? 12 : 8))}deg) translateY(-${flowerSize * 0.2}px)`,
              }}
            />
          ))}
          {/* Center disc florets */}
          <div
            className="absolute rounded-full"
            style={{
              width: flowerSize * 0.35,
              height: flowerSize * 0.35,
              background: `radial-gradient(circle, ${cornflowerColors.petalsLight}, ${cornflowerColors.petalsDark})`,
              left: '50%',
              top: '50%',
              marginLeft: -flowerSize * 0.175,
              marginTop: -flowerSize * 0.175,
            }}
          />
        </div>
      )}

      {/* Seed stage (0) */}
      {stage < 1 && (
        <div
          className="absolute rounded-full"
          style={{
            bottom: dimensions.container * 0.22,
            width: 5,
            height: 3,
            backgroundColor: '#374151',
          }}
        />
      )}
    </div>
  );
}

export function AnimatedCharacter({
  theme,
  stage,
  colorPalette: _colorPalette,
  isAnimating = false,
  size = 'medium',
}: AnimatedCharacterProps) {
  const dimensions = sizeMap[size];

  // Get accent color based on flower type
  const getAccentColor = () => {
    switch (theme) {
      case 'rose': return roseColors.petals;
      case 'lily': return lilyColors.center;
      case 'tulip': return tulipColors.petals;
      case 'carnation': return carnationColors.petals;
      case 'peony': return peonyColors.petals;
      case 'poppy': return poppyColors.petals;
      case 'sunflower': return sunflowerColors.petals;
      case 'iris': return irisColors.petals;
      case 'lavender': return lavenderColors.petals;
      case 'lily-of-valley': return lilyOfValleyColors.bells;
      case 'bluebell': return bluebellColors.petals;
      case 'buttercup': return buttercupColors.petals;
      case 'cornflower': return cornflowerColors.petals;
      default: return '#22C55E'; // Green for plant
    }
  };

  const accentColor = getAccentColor();

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dimensions.container, height: dimensions.container }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${accentColor}40, transparent)`,
        }}
        animate={{
          scale: isAnimating ? [1, 1.2, 1] : 1,
          opacity: isAnimating ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
      />

      {/* Character container with animation */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isAnimating ? [1, 1.1, 1] : 1,
          rotate: isAnimating ? [0, 5, -5, 0] : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {theme === 'plant' && <PlantCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'rose' && <RoseCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'lily' && <LilyCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'tulip' && <TulipCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'carnation' && <CarnationCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'peony' && <PeonyCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'poppy' && <PoppyCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'sunflower' && <SunflowerCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'iris' && <IrisCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'lavender' && <LavenderCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'lily-of-valley' && <LilyOfValleyCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'bluebell' && <BluebellCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'buttercup' && <ButtercupCharacter stage={stage} dimensions={dimensions} />}
        {theme === 'cornflower' && <CornflowerCharacter stage={stage} dimensions={dimensions} />}

        {/* Growth level indicators (dots) */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(Math.min(stage + 1, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: size === 'small' ? 4 : 6,
                height: size === 'small' ? 4 : 6,
                backgroundColor: accentColor,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Sparkle effects for high stages */}
      {stage >= 5 && (
        <>
          <motion.div
            className="absolute"
            style={{ top: '10%', right: '10%' }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Sparkles size={size === 'small' ? 12 : 16} style={{ color: accentColor }} />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ bottom: '15%', left: '10%' }}
            animate={{
              scale: [0, 1, 0],
              rotate: [360, 180, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: 1,
            }}
          >
            <Sparkles size={size === 'small' ? 10 : 14} style={{ color: accentColor }} />
          </motion.div>
        </>
      )}

      {/* Completion animation particles */}
      {isAnimating && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                backgroundColor: accentColor,
                top: '50%',
                left: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 50,
                y: Math.sin((i * Math.PI) / 3) * 50,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
