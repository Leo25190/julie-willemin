export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  date: string;
  featured: boolean;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface WorkExperience {
  organisationName: string;
  position: string;
  date: string;
  info: string[];
}

export interface ContactOption {
  name: string;
  link: string;
}

export interface SelectedProject {
  name: string;
  link: string;
}