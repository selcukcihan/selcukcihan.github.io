import { Mail, Github, Linkedin, BookOpen, Twitter, Library, Youtube, FileText, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Twitter,
  Library,
  Youtube,
  FileText,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail
}
