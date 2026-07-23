import { describe, expect, it } from "vitest";

import { generateArtifacts } from "../scripts/generator";
import { searchCareer } from "../src/search";
import { sentinelSource } from "./fixtures";

const index = generateArtifacts(sentinelSource(), "e".repeat(40)).searchIndex;

describe("career search", () => {
  it.each([
    ["Google Cloud", "example-role"],
    ["GCP", "example-role"],
    ["datadog", "example-role"],
    [".NET", "microsoft-net"],
    ["Scala", "example-role"],
    ["GraphQL", "example-role"],
    ["NodeJS", "node-js"],
    ["B2B", "preferences"],
    ["async communication", "preferences"],
  ])("finds aliases and compound labels for %s", (query, expectedId) => {
    expect(searchCareer(index, query, undefined, 10).map(({ id }) => id)).toContain(
      expectedId,
    );
  });

  it("ranks exact technology evidence above generic body mentions", () => {
    const source = sentinelSource();
    source.experience.push({
      id: "generic-body-match",
      title: "Other Engineer",
      company: "Other Company",
      dates: "2018",
      descriptions: ["Helped migrate a service to GCP."],
    });
    const customIndex = generateArtifacts(source, "f".repeat(40)).searchIndex;
    expect(searchCareer(customIndex, "GCP", undefined, 10)[0]!.id).toBe(
      "example-role",
    );
  });

  it("applies section filters and result limits", () => {
    expect(searchCareer(index, "software", ["skills"], 10)).toEqual([]);
    expect(searchCareer(index, "example", undefined, 1)).toHaveLength(1);
  });

  it("uses stable ordering", () => {
    const first = searchCareer(index, "example", undefined, 20);
    const second = searchCareer(index, "example", undefined, 20);
    expect(second).toEqual(first);
  });

  it("cannot search excluded reference values", () => {
    expect(
      searchCareer(index, "CONTACT_SENTINEL_7f23a9", undefined, 20),
    ).toEqual([]);
  });
});
