import { Mail, Github, Linkedin, BookOpen, Twitter, Library, TypeIcon as type, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Twitter,
  Library,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail
}

