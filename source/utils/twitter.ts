import enquirer from "enquirer";
import { getConf } from "./conf.js";

export async function getTwitter(gitHubNamespace?: string) {
  const conf = getConf();
  const { twitter } = await enquirer.prompt<{ twitter?: string; }>({
    type: "input",
    name: "twitter",
    message: "Twitter handle?",
    default: conf.get(`twitter:${gitHubNamespace}`) ?? gitHubNamespace
  } as any).catch(() => ({ twitter: undefined }));
  if(twitter) {
    conf.set(`twitter:${gitHubNamespace}`, twitter);
    return twitter;
  } else {
    return undefined;
  }
}
