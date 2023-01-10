import clee from "clee";
import open from "open";
import { structure } from "../../../structure.js";
import { getRepositoryURL } from "../../../utils/index.js";

export const openRepoIssues = clee("issues")
  .description("Open the repository's issues page")
  .action(async () => {
    const pkg = await structure().files().packageJSON.read();
    const url = getRepositoryURL(pkg?.repository);
    if(url) {
      await open(`${url}/issues`);
    }
  });
