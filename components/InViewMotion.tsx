import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface InViewMotionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function InViewMotion({ children, direction = 'up' }: InViewMotionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // 動畫初始狀態依照方向決定
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 30 };
      case 'down':
        return { opacity: 0, y: -30 };
      case 'left':
        return { opacity: 0, x: 30 };
      case 'right':
        return { opacity: 0, x: -30 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
