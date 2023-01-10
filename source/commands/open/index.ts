import clee from "clee";
import { openRepo } from "./repo/index.js";
import { openNPM } from "./npm.js";
import { openEditor } from "./editor.js";
import openKraken from "gitkraken-cli";

export const open = clee("open")
  .description("Open the project in various ways")
  .command(openRepo)
  .command(openNPM)
  .command(openEditor)
  .command(openKraken);
