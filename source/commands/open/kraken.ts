import clee from "clee";
import { openAction } from "gitkraken-cli";

export const openKraken = clee("kraken")
  .description("Open the current repository in GitKraken")
  .action(openAction);
