import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animation: 'success' | 'loading' | 'document' | 'rocket' | 'briefcase';
  className?: string;
  loop?: boolean;
}

const animations = {
  success: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Success Animation",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Checkmark",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 0, 100], e: [120, 120, 100] },
              { t: 40, s: [120, 120, 100], e: [100, 100, 100] },
              { t: 60, s: [100, 100, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [80, 80] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 40 }
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.3, 0.7, 0.3, 1] },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      }
    ]
  },
  loading: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 100,
    h: 100,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: []
  },
  document: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Document",
    ddd: 0,
    assets: [],
    layers: []
  },
  rocket: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 180,
    w: 200,
    h: 200,
    nm: "Rocket Launch",
    ddd: 0,
    assets: [],
    layers: []
  },
  briefcase: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Briefcase",
    ddd: 0,
    assets: [],
    layers: []
  }
};

export function LottieAnimation({ animation, className = '', loop = true }: LottieAnimationProps) {
  const animationData = animations[animation];

  if (!animationData) {
    return null;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
