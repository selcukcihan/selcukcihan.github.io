import { Certification } from '../types/data'

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect",
    level: "Professional",
    issuer: "Amazon Web Services",
    issued: "2022",
    expires: "2025",
    imageUrl: "/architect.png?height=64&width=64",
    url: "https://www.credly.com/badges/f2b93002-0754-4e37-8d31-031d2d520ee3",
  },
  {
    name: "AWS Certified Developer",
    level: "Associate",
    issuer: "Amazon Web Services",
    issued: "2019",
    expires: "2022",
    imageUrl: "/developer.png?height=64&width=64",
    url: "https://www.credly.com/badges/3fb06d81-a97f-4182-ada1-bdcc221152de",
  }
]
