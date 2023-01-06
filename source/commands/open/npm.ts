import clee from "clee";
import open from "open";
import { structure } from "../../structure.js";
import { getNPMURL } from "../../utils/index.js";

export const openNPM = clee("npm")
  .action(async () => {
    const pkg = await structure().files().packageJSON.read();
    const url = getNPMURL(pkg?.name);
    if(url) {
      await open(url);
    }
  });
