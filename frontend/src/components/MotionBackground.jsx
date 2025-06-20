import React from 'react';

const MotionBackground = () => {
  const pulseAnimation = {
    animationName: 'pulse',
    animationDuration: '4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  };

  const spinAnimation = {
    animationName: 'spin',
    animationDuration: '30s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  };

  const bounceAnimation = {
    animationName: 'bounce',
    animationDuration: '4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  };

  const pingAnimation = {
    animationName: 'ping',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-out',
  };

  const pingDelay = (delay) => ({
    animationDelay: delay,
  });

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10%); }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          @keyframes float {
            0%, 100% { background-position: 0 0, 0 0; }
            50% { background-position: 20px 20px, 20px 20px; }
          }
        `}
      </style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -10,
          overflow: 'hidden',
        }}
      >
        {/* Dark purple gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, black, #1e0637, #2a313d)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(45deg, transparent, rgba(102, 51, 153, 0.125), rgba(115, 75, 162, 0.0625))',
            }}
          />
        </div>

        {/* Purple floating orbs */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: 384, // 96 * 4
            height: 384,
            background: 'linear-gradient(90deg, rgba(128, 90, 213, 0.1), rgba(101, 63, 164, 0.15))',
            borderRadius: '50%',
            filter: 'blur(48px)',
            ...pulseAnimation,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '75%',
            right: '25%',
            width: 320,
            height: 320,
            background: 'linear-gradient(90deg, rgba(128, 64, 255, 0.15), rgba(77, 0, 191, 0.1))',
            borderRadius: '50%',
            filter: 'blur(48px)',
            animationDelay: '2s',
            animationName: 'pulse',
            animationDuration: '4s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 256,
            height: 256,
            background: 'linear-gradient(90deg, rgba(153, 102, 255, 0.2), rgba(115, 75, 162, 0.15))',
            borderRadius: '50%',
            filter: 'blur(32px)',
            animationDelay: '4s',
            animationName: 'pulse',
            animationDuration: '4s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />

        {/* Professional geometric elements */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 80,
            width: 32,
            height: 32,
            border: '1px solid rgba(168, 85, 247, 0.3)',
            transform: 'rotate(45deg)',
            animationName: 'spin',
            animationDuration: '30s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            width: 24,
            height: 24,
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '50%',
            animationName: 'bounce',
            animationDuration: '4s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '33.33%',
            right: '33.33%',
            width: 16,
            height: 16,
            backgroundColor: 'rgba(128, 90, 213, 0.3)',
            transform: 'rotate(12deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '33.33%',
            left: '33.33%',
            width: 12,
            height: 12,
            backgroundColor: 'rgba(115, 75, 162, 0.4)',
            borderRadius: '50%',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.02,
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              animationName: 'float',
              animationDuration: '15s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        </div>

        {/* Purple accent dots */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 64,
            width: 4,
            height: 4,
            backgroundColor: 'rgba(168, 85, 247, 0.5)',
            borderRadius: '50%',
            animationName: 'ping',
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 128,
            right: 128,
            width: 4,
            height: 4,
            backgroundColor: 'rgba(168, 85, 247, 0.6)',
            borderRadius: '50%',
            animationName: 'ping',
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
            animationDelay: '2s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 128,
            left: 128,
            width: 4,
            height: 4,
            backgroundColor: 'rgba(128, 90, 213, 0.6)',
            borderRadius: '50%',
            animationName: 'ping',
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
            animationDelay: '4s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            right: 64,
            width: 4,
            height: 4,
            backgroundColor: 'rgba(115, 75, 162, 0.7)',
            borderRadius: '50%',
            animationName: 'ping',
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
            animationDelay: '1s',
          }}
        />
      </div>
    </>
  );
};

export default MotionBackground;
