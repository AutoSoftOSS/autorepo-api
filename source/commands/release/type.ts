import clee from "clee";
import conventionalRecommendedBump from "conventional-recommended-bump";

export const releaseType = clee("type")
  .description("Output the recommended release type")
  .action(async () => {
    return new Promise<conventionalRecommendedBump.Callback.Recommendation.ReleaseType>((resolve, reject) => {
      conventionalRecommendedBump({ preset: "conventionalcommits" }, (error, result) => {
        if(error) {
          reject(error);
        } else {
          resolve(result.releaseType ?? "patch");
        }
      });
    });
  });
