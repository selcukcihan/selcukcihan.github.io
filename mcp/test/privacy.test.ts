import { describe, expect, it } from "vitest";

import { generateArtifacts } from "../scripts/generator";
import { actualSource, sentinelSource } from "./fixtures";

function serializedArtifacts(source = sentinelSource()): string {
  const artifacts = generateArtifacts(source, "c".repeat(40));
  return JSON.stringify(artifacts);
}

describe("publication privacy boundary", () => {
  it("excludes email and all reference-derived content by default", () => {
    const output = serializedArtifacts();
    expect(output).not.toContain("private-candidate-email@example.invalid");
    expect(output).not.toContain("CONTACT_SENTINEL_7f23a9");
    expect(output).not.toContain("SHORT_TESTIMONIAL_SENTINEL_49cd11");
    expect(output).not.toContain("FULL_TESTIMONIAL_SENTINEL_b61e07");
    expect(output).not.toContain("GENERATION_SENTINEL_124a81");
  });

  it("includes email only after explicit opt-in", () => {
    const source = sentinelSource();
    source.publication = { mcp: { include_email: true } };
    expect(serializedArtifacts(source)).toContain(
      "private-candidate-email@example.invalid",
    );
  });

  it("publishes only sanitized short testimonials after explicit opt-in", () => {
    const source = sentinelSource();
    source.publication = { mcp: { include_short_testimonials: true } };
    const output = serializedArtifacts(source);
    expect(output).toContain("SHORT_TESTIMONIAL_SENTINEL_49cd11");
    expect(output).not.toContain("CONTACT_SENTINEL_7f23a9");
    expect(output).not.toContain("FULL_TESTIMONIAL_SENTINEL_b61e07");
  });

  it("does not add excluded values to search documents", () => {
    const source = sentinelSource();
    source.publication = { mcp: { include_email: true } };
    const { searchIndex } = generateArtifacts(source, "d".repeat(40));
    const output = JSON.stringify(searchIndex);
    expect(output).not.toContain("private-candidate-email@example.invalid");
    expect(output).not.toContain("CONTACT_SENTINEL_7f23a9");
    expect(output).not.toContain("FULL_TESTIMONIAL_SENTINEL_b61e07");
  });

  it("excludes every actual contact and long testimonial", () => {
    const source = actualSource();
    const output = JSON.stringify(generateArtifacts(source, "e".repeat(40)));
    expect(output).not.toContain(source.basics.email);
    for (const reference of source.references) {
      expect(output).not.toContain(reference.contact);
      if (reference.fullTestimonial) {
        expect(output).not.toContain(reference.fullTestimonial);
      }
    }
  });
});
