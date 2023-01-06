import clee from "clee";
import open from "open";
import { structure } from "../../structure.js";
import { getRepositoryURL } from "../../utils/index.js";

export const openRepo = clee("repo")
  .action(async () => {
    const pkg = await structure().files().packageJSON.read();
    const url = getRepositoryURL(pkg?.repository);
    if(url) {
      await open(url);
    }
  });
