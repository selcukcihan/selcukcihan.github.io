/* eslint-disable react/no-unescaped-entities */

import {
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TestimonialsSection } from "@/components/testimonials-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToptalBadge } from "@/components/toptal-badge";
import { getPortfolioData } from "@/lib/candidate-profile";
import { getIcon } from "@/utils/get-icon";

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
        className="text-slate-900 dark:text-slate-100 hover:text-slate-950 dark:hover:text-slate-200 underline inline-flex items-center gap-1 transition-colors"
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
  const {
    profileData,
    testimonials,
    careerExperiences,
    education,
    certifications,
  } = getPortfolioData();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container relative px-4 md:px-6 pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <div className="flex-shrink-0 relative flex flex-col items-center">
                <Image
                  alt="Profile Picture"
                  className="relative rounded-full border-2 border-slate-200 dark:border-slate-800 shadow-lg w-48 md:w-60"
                  height="240"
                  src={profileData.image}
                  style={{
                    aspectRatio: "240/240",
                    objectFit: "cover",
                  }}
                  width="240"
                />
                <div className="mt-5">
                  <ToptalBadge />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                    {profileData.name}
                  </h1>

                  <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
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

                <div className="flex flex-wrap xl:flex-nowrap gap-2 justify-center lg:justify-start">
                  {profileData.socials.map((social, index) => {
                    const Icon = getIcon(social.icon);
                    const isEmail = social.platform === "Email";

                    return (
                      <Button
                        key={social.platform}
                        asChild
                        variant={isEmail ? "default" : "outline"}
                        size="lg"
                        className={`gap-2 transition-colors duration-200 ${
                          isEmail
                            ? "bg-slate-900 hover:bg-slate-950 text-white px-4 w-32"
                            : "border border-slate-300 dark:border-slate-700 hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200 dark:hover:border-slate-400 px-4 w-32"
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

      <TestimonialsSection testimonials={testimonials} />

      {/* Experience Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
                  className="group transition-shadow duration-200 hover:shadow-md border border-slate-200 dark:border-slate-800 border-l-2 border-l-slate-900 dark:border-l-slate-700 bg-white dark:bg-slate-900"
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
                              className="text-sm text-slate-900 dark:text-slate-100 hover:text-slate-950 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
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
                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-700">
                          {experience.period}
                        </span>
                      </div>
                    </div>

                    {experience.achievements && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                          {experience.achievements.map((achievement, i) => (
                            <li key={i}>
                              {parseAchievement(achievement)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.tech && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.tech.map((tech, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-slate-200 dark:border-slate-700 transition-colors duration-200"
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Qualifications & Certifications
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          {edu.year && (
                            <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded border border-slate-200 dark:border-slate-700">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          {edu.university}
                        </p>
                        {edu.details && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                            {edu.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardContent className="p-8">
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
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            <Link
                              href={certification.url}
                              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
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
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200"
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
    </div>
  );
}
