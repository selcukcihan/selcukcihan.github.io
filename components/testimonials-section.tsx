"use client";

import { useState } from "react";

import type { Testimonial } from "@/app/types/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const closeModal = () => {
    setSelectedTestimonial(null);
  };

  return (
    <>
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Client Testimonials
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="group transition-shadow duration-200 hover:shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        &quot;{testimonial.quote}&quot;
                      </p>

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
                          className="group-hover:text-slate-900 dark:group-hover:text-slate-100 p-0 h-auto font-medium"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          Read full testimonial
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

      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-4 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTestimonial.author} - {selectedTestimonial.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  x
                </Button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedTestimonial.fullTestimonial}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
