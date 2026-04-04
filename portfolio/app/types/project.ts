export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: number;
  icon: string;
  title: string;
  company: string;
  period: string;
  category: string;
  description: string;
  details: string[];
  achievements: string[];
  tech: string[];
  color: string;
  images?: ProjectImage[];
}

export interface CardProps {
  project: Project;
  className?: string;
}

export interface ModalProps {
  project: Project;
  onClose: () => void;
}
