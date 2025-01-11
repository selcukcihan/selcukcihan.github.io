export interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  company: string
  fullTestimonial: string
}

export interface CareerExperience {
  company: string
  website?: Website
  role: string
  position?: string
  period: string
  description?: string
  achievements?: string[]
  tech?: string[]
}

export interface Education {
  degree: string
  university: string
  year: string
  details?: string
}

export interface Certification {
  name: string
  level: string
  issuer: string
  issued: string
  expires: string
  imageUrl: string
  url: string
}

export interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
  substack: string
  stackoverflow: string
  email: string
}

export interface ProfileData {
  name: string
  title: string
  bio: string[]
  image: string
  socials: Social[]
}

export interface Website {
  name: string
  url: string
}

export interface Social {
  platform: string
  url: string
  icon: string
}
