/**
 * Run every solution file's own test suite (each file asserts all of its
 * approaches agree on the expected answers) and report a summary.
 *
 *   npm test                 # all 75 problems
 *   npm test -- 04_graph     # only files whose path contains "04_graph"
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const filter = process.argv[2] ?? "";

const files = readdirSync(root)
  .filter((dir) => /^\d\d_/.test(dir))
  .sort()
  .flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((f) => f.endsWith(".ts"))
      .sort()
      .map((f) => join(root, dir, f)),
  )
  .filter((file) => relative(root, file).includes(filter));

let failed = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, [file], { encoding: "utf8" });
  const name = relative(root, file);
  if (result.status === 0) {
    console.log(`PASS  ${name}  ${result.stdout.trim()}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}\n${result.stdout}${result.stderr}`);
  }
}

console.log(`\n${files.length - failed}/${files.length} files passed.`);
process.exitCode = failed > 0 ? 1 : 0;
