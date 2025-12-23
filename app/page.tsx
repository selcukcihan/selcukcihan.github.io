"use client";

/* eslint-disable react/no-unescaped-entities */

import {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Twitter,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Code,
  Cloud,
  Database,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/utils/get-icon";

import { profileData } from "./data/profile";
import { testimonials } from "./data/testimonials";
import { careerExperiences } from "./data/career";
import { education } from "./data/education";
import { certifications } from "./data/certifications";

// Helper function to parse achievement strings and convert HTML links to React components
function parseAchievement(achievement: string): React.ReactNode {
  // Match <a href='...'>text</a> or <a href="...">text</a>
  const linkRegex = /<a\s+href=['"]([^'"]+)['"]\s*>(.*?)<\/a>/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(achievement)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(achievement.substring(lastIndex, match.index));
    }

    // Add the link component
    parts.push(
      <Link
        key={match.index}
        href={match[1]}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline inline-flex items-center gap-1 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[2]}
        <ExternalLink className="h-3 w-3" />
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < achievement.length) {
    parts.push(achievement.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : achievement;
}

export default function Portfolio() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(
    null
  );

  const handleTestimonialClick = (testimonial: any) => {
    setSelectedTestimonial(testimonial.fullTestimonial);
  };

  const closeModal = () => {
    setSelectedTestimonial(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10"></div>
        <div className="container relative px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <div className="flex-shrink-0 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <Image
                  alt="Profile Picture"
                  className="relative rounded-full border-4 border-white shadow-2xl"
                  height="240"
                  src={profileData.image}
                  style={{
                    aspectRatio: "240/240",
                    objectFit: "cover",
                  }}
                  width="240"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Available for new projects
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                    {profileData.name}
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                    {profileData.title}
                  </p>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  {profileData.bio.map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {profileData.socials.map((social, index) => {
                    const Icon = getIcon(social.icon);
                    const isEmail = social.platform === "Email";

                    return (
                      <Button
                        key={social.platform}
                        asChild
                        variant={isEmail ? "default" : "outline"}
                        size="lg"
                        className={`gap-2 transition-all duration-200 hover:scale-105 ${
                          isEmail
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                            : "border-2 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        <Link
                          href={social.url}
                          target={isEmail ? undefined : "_blank"}
                          rel={isEmail ? undefined : "noopener noreferrer"}
                        >
                          <Icon className="h-5 w-5" />
                          {social.platform}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  7+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Years on AWS
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Projects Delivered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400">
                  2
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AWS Certifications
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 mb-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                What clients say
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Client Testimonials
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Trusted by teams at leading companies worldwide
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="group hover:shadow-2xl transition-all duration-200 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                >
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>

                      <Separator className="bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700" />

                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.title}, {testimonial.company}
                        </p>
                      </div>

                      {testimonial.fullTestimonial && (
                        <Button
                          variant="ghost"
                          className="group-hover:text-blue-600 dark:group-hover:text-blue-400 p-0 h-auto font-medium"
                          onClick={() => handleTestimonialClick(testimonial)}
                        >
                          Read full testimonial
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 mb-4">
                <Briefcase className="h-4 w-4 mr-2" />
                Professional Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Experience & Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Building scalable solutions across diverse industries
              </p>
            </div>

            <div className="space-y-8">
              {careerExperiences.map((experience, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-200 border-l-4 border-l-blue-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {experience.company}
                          </h3>
                          {experience.website && (
                            <Link
                              href={experience.website.url}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {experience.website.name}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          {experience.role}
                        </p>
                      </div>
                      <div className="mt-2 lg:mt-0">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                          {experience.period}
                        </span>
                      </div>
                    </div>

                    {experience.achievements && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {experience.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                            >
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{parseAchievement(achievement)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.tech && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4 text-blue-500" />
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.tech.map((tech, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700 mb-4">
                <Award className="h-4 w-4 mr-2" />
                Credentials & Education
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Qualifications & Certifications
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Continuous learning and professional development
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Cloud className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      AWS Certifications
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {certifications.map((certification, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="relative">
                          <Image
                            alt={certification.name}
                            className="rounded-lg shadow-lg"
                            height="80"
                            src={certification.imageUrl}
                            width="80"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            <Link
                              href={certification.url}
                              className="inline-flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {certification.name}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {certification.level} • {certification.issuer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Issued: {certification.issued} • Expires:{" "}
                            {certification.expires}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Education
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          {edu.university}
                        </p>
                        {edu.details && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                            {edu.details}
                          </p>
                        )}
                        {index < education.length - 1 && (
                          <Separator className="bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your next project and bring your ideas to life with
              cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Link href="mailto:selcukcihan@gmail.com">
                  <Mail className="h-5 w-5 mr-2" />
                  Get in touch
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Link
                  href="https://linkedin.com/in/selcukcihan"
                  target="_blank"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  <span>Connect on LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold mb-2">{profileData.name}</p>
                <p className="text-gray-400">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>

              <div className="flex gap-4">
                {profileData.socials.map((social) => {
                  const Icon = getIcon(social.icon);
                  return (
                    <Link
                      key={social.platform}
                      href={social.url}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors hover:scale-110 transform duration-200"
                      target={
                        social.platform === "Email" ? undefined : "_blank"
                      }
                      rel={
                        social.platform === "Email"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      title={`Connect on ${social.platform}`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Full Testimonial
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </Button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedTestimonial}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
