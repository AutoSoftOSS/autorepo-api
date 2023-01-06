import clee from "clee";
import { openRepo } from "./repo/index.js";
import { openNPM } from "./npm.js";
import { openEditor } from "./editor.js";
import { openKraken } from "./kraken.js";

export const open = clee("open")
  .command(openRepo)
  .command(openNPM)
  .command(openEditor)
  .command(openKraken);
