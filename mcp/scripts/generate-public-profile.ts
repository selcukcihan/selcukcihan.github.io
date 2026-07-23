import { generateFromFile, writeArtifacts } from "./generator";

try {
  const artifacts = generateFromFile(process.argv[2]);
  writeArtifacts(artifacts);
  process.stdout.write(
    `Generated public career data ${artifacts.metadata.dataVersion}\n`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown generation error";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
