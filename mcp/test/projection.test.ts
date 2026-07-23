import { describe, expect, it } from "vitest";

import {
  generateArtifacts,
  projectPublicProfile,
  validateSource,
} from "../scripts/generator";
import { sentinelSource } from "./fixtures";

describe("public projection", () => {
  it("normalizes public links and retains original display labels", () => {
    const projection = projectPublicProfile(sentinelSource());
    expect(projection.profile.url).toBe("https://example.com");
    expect(projection.experience[0]!.tech).toContain("Java/Scala");
    expect(projection.skills[0]!.label).toBe("Microsoft .Net");
  });

  it("fails on generated ID collisions", () => {
    const source = sentinelSource();
    source.experience.push({
      title: "Software Engineer",
      company: "Example Company",
      dates: "2018",
    });
    delete source.experience[0]!.id;
    expect(() => projectPublicProfile(source)).toThrow(
      /Duplicate experience ID/,
    );
  });

  it("produces a stable public data hash for identical content", () => {
    const source = sentinelSource();
    const first = generateArtifacts(source, "a".repeat(40));
    const second = generateArtifacts(source, "b".repeat(40));
    expect(first.publicData.dataVersion).toBe(second.publicData.dataVersion);
    expect(first.publicData.sourceCommit).not.toBe(second.publicData.sourceCommit);
  });

  it("keeps empty preferences and narrative unpublished", () => {
    const source = sentinelSource();
    source.career_preferences = {};
    source.career_narrative = {};
    const projection = projectPublicProfile(validateSource(source));
    expect(projection.careerPreferences).toBeNull();
    expect(projection.careerNarrative).toBeNull();
  });
});
