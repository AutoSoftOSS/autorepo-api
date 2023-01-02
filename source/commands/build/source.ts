import clee from "clee";
import { join } from "node:path";
import run from "package-run";
import { structure } from "../../structure.js";

export const buildSource = clee("source")
  .description("Build source files")
  .option("-c", "--cjs", "Output in CommonJS format")
  .action(async (options) => {
    const outputFormat = options.cjs === true ? "cjs" : "esm";
    await (run as unknown as { default: typeof run }).default({
      command: "swc",
      args: [structure().files().source.name, {
        "config-file": join(new URL(import.meta.url).pathname, `../../../config/${outputFormat}.swcrc`),
        "copy-files": true,
        "delete-dir-on-start": true,
        "out-dir": structure().files().auto.files().build.relative
      }]
    });
  });
