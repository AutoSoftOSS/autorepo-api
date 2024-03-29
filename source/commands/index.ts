import clee from "clee";
import { init } from "./init/index.js";
import { update } from "./update/index.js";
import { exportPackage } from "./export.js";
import { build } from "./build/index.js";
import { importPackage } from "./import.js";
import { create } from "./create.js";
import { dev } from "./dev.js";
import { lint } from "./lint/index.js";
import { open } from "./open/index.js";
import { test } from "./test/index.js";
import { typecheck } from "./typecheck.js";
import { release } from "./release/index.js";

export const autorepo = clee("autorepo")
  .title({ font: "Slant" })
  .description("Full Auto.")
  .command(init)
  .command(create)
  .command(importPackage)
  .command(exportPackage)
  .command(open)
  .command(update)
  .command(build)
  .command(dev)
  .command(lint)
  .command(release)
  .command(test)
  .command(typecheck);

export * from "./init/index.js";
export * from "./create.js";
export * from "./import.js";
export * from "./export.js";
export * from "./build/index.js";
export * from "./dev.js";
export * from "./lint/index.js";
export * from "./test/index.js";
export * from "./typecheck.js";
export * from "./release/index.js";
export * from "./update/index.js";
