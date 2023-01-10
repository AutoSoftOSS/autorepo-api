import clee from "clee";
import open from "open";
import { structure } from "../../../structure.js";
import { getRepositoryURL } from "../../../utils/index.js";

export const openRepoReleases = clee("releases")
  .description("Open the repository's releases page")
  .action(async () => {
    const pkg = await structure().files().packageJSON.read();
    const url = getRepositoryURL(pkg?.repository);
    if(url) {
      await open(`${url}/releases`);
    }
  });
