'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  forceVisible?: boolean;
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.12,
  forceVisible = false,
}: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      initial={forceVisible ? false : 'hidden'}
      animate={forceVisible ? 'visible' : undefined}
      whileInView={forceVisible ? undefined : 'visible'}
      viewport={forceVisible ? undefined : { once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
