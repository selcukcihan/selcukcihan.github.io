"use client";

import {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Twitter,
  Library,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24">
        <div className="relative">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <Image
                  alt="Profile Picture"
                  className="rounded-full border-8 border-muted"
                  height="200"
                  src={profileData.image}
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {profileData.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-2 text-center md:text-left">
                  {profileData.title}
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-2 min-[400px]:flex-row flex-wrap justify-end items-center">
                {profileData.socials.map((social, index) => {
                  const Icon = getIcon(social.icon);
                  const isEmail = index === 0;

                  return (
                    <Button
                      key={social.platform}
                      asChild
                      variant={isEmail ? "default" : "outline"}
                      className="gap-2"
                    >
                      <Link
                        href={social.url}
                        target={isEmail ? undefined : "_blank"}
                        rel={isEmail ? undefined : "noopener noreferrer"}
                      >
                        <Icon className="h-4 w-4" />
                        {social.platform}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              {profileData.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-500 md:text-xl dark:text-gray-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row flex-wrap md:hidden">
              {profileData.socials.map((social, index) => {
                const Icon = getIcon(social.icon);
                const isEmail = index === 0;

                return (
                  <Button
                    key={social.platform}
                    asChild
                    variant={isEmail ? "default" : "outline"}
                    className="gap-2"
                  >
                    <Link
                      href={social.url}
                      target={isEmail ? undefined : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                    >
                      <Icon className="h-4 w-4" />
                      {social.platform}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 md:px-6 py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">
          Client Testimonials
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="italic">{testimonial.quote}</p>
                  <Separator />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                  {testimonial.fullTestimonial && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary hover:text-primary/80"
                      onClick={() => window.alert(testimonial.fullTestimonial)}
                    >
                      Click to read more →
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Credentials Section */}
      <section className="container px-4 md:px-6 py-12 bg-muted/50">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">
          Credentials
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">AWS Certifications</h3>
              <div className="grid gap-6">
                {certifications.map((certification, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Image
                        alt={certification.name}
                        className="rounded-lg"
                        height="128"
                        src={certification.imageUrl}
                        width="128"
                      />
                      <div className="space-y-1">
                        <h4 className="font-semibold">
                          <Link
                            href={certification.url}
                            className="inline-flex items-center gap-1 hover:text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {certification.name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {certification.level}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {certification.issuer}
                        </p>
                      </div>
                    </div>
                    {index < certifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Education</h3>
              <div className="grid gap-6">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.year}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{edu.university}</p>
                    {edu.details && (
                      <p className="text-sm text-gray-500">{edu.details}</p>
                    )}
                    {index < education.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Experience Section */}
      <section className="container px-4 md:px-6 py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">
          Professional Experience
        </h2>
        <div className="grid gap-8">
          {careerExperiences.map((experience, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">
                        {experience.company}
                      </h3>
                      {experience.website && (
                        <Link
                          href={experience.website.url}
                          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {experience.website.name}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    <p className="text-muted-foreground">{experience.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {experience.period}
                  </p>
                </div>
                {experience.description && (
                  <p className="text-gray-500 mb-4">{experience.description}</p>
                )}
                {experience.achievements && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                      {experience.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {experience.tech && (
                  <div className="flex flex-wrap gap-2">
                    {experience.tech.map((tech, i) => (
                      <Badge key={i} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-12 px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profileData.name}. All rights
            reserved.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {profileData.socials.map((social) => (
              <Link
                key={social.platform}
                href={social.url}
                className="text-sm text-muted-foreground hover:text-primary"
                target={social.platform === "Email" ? undefined : "_blank"}
                rel={
                  social.platform === "Email"
                    ? undefined
                    : "noopener noreferrer"
                }
              >
                {social.platform}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
