'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/app/types/content';
import { HeroCard } from './HeroCard';
import { TitleInfoCard } from './TitleInfoCard';
import { TechStackCard } from './TechStackCard';
import { QuickInfoCard } from './QuickInfoCard';
import { DetailsCard } from './DetailsCard';
import { AchievementsCard } from './AchievementsCard';
import { DescriptionCard } from './DescriptionCard';

interface BentoGridProps {
  project: Project;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function BentoGrid({ project }: BentoGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8"
    >
      {/* Desktop: 4列网格 */}
      <div className="hidden xl:grid xl:grid-cols-4 xl:grid-rows-[auto_auto_auto] gap-5">
        <motion.div variants={itemVariants} className="xl:col-span-2 xl:row-span-2">
          <HeroCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <TitleInfoCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <TechStackCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="xl:col-span-1 xl:row-span-1">
          <QuickInfoCard project={project} />
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-2">
          <DetailsCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <AchievementsCard project={project} />
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-4">
          <DescriptionCard project={project} />
        </motion.div>
      </div>

      {/* Tablet: 2列网格 */}
      <div className="hidden md:grid md:grid-cols-2 xl:hidden gap-5">
        <motion.div variants={itemVariants} className="md:col-span-2">
          <HeroCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TitleInfoCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickInfoCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-2">
          <TechStackCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DetailsCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AchievementsCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-2">
          <DescriptionCard project={project} />
        </motion.div>
      </div>

      {/* Mobile: 单列堆叠 */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        <motion.div variants={itemVariants}>
          <HeroCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TitleInfoCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickInfoCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TechStackCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DetailsCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AchievementsCard project={project} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DescriptionCard project={project} />
        </motion.div>
      </div>
    </motion.div>
  );
}
