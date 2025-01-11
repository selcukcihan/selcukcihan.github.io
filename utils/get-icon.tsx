import { Mail, Github, Linkedin, BookOpen, Twitter, Library, Youtube, TypeIcon as type, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Twitter,
  Library,
  Youtube,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail
}

