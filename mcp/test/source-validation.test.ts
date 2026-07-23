import { describe, expect, it } from "vitest";

import { validateSource } from "../scripts/generator";
import { actualSource, sentinelSource } from "./fixtures";

describe("source schema validation", () => {
  it("validates the actual résumé YAML", () => {
    expect(validateSource(actualSource()).schema_version).toBe(1);
  });

  it("accepts absent projects and optional additive sections", () => {
    const source = sentinelSource();
    delete source.projects;
    delete source.career_preferences;
    delete source.career_narrative;
    expect(validateSource(source)).toBe(source);
  });

  it("accepts flat skills and human-readable dates", () => {
    const source = sentinelSource();
    source.skills = ["Java/Scala", "SQL/NoSQL"];
    source.experience[0]!.dates = "Spring 2020 through late 2024";
    expect(validateSource(source)).toBe(source);
  });

  it("rejects invalid IDs", () => {
    const source = structuredClone(sentinelSource());
    source.experience[0]!.id = "Not Valid";
    expect(() => validateSource(source)).toThrow(/\/experience\/0\/id/);
  });

  it("rejects unknown source fields", () => {
    const source = {
      ...sentinelSource(),
      unknown_private_field: "UNKNOWN_SOURCE_SENTINEL_990e10",
    };
    expect(() => validateSource(source)).toThrow(/additional properties/);
  });

  it("allows empty preference and narrative objects", () => {
    const source = sentinelSource();
    source.career_preferences = {};
    source.career_narrative = {};
    expect(validateSource(source)).toBe(source);
  });

  it("rejects malformed preference time and currency values", () => {
    const source = sentinelSource();
    source.career_preferences!.overlap_availability!.start_time = "8am";
    source.career_preferences!.commercial_terms!.payment_currency = "dollars";
    expect(() => validateSource(source)).toThrow(/career_preferences/);
  });
});
