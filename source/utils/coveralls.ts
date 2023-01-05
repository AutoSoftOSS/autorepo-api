import Coveralls from "coveralls-api";
import enquirer from "enquirer";
import { getConf } from "./conf.js";

export async function getCoveralls() {
  const conf = getConf();
  const { coverallsToken } = await enquirer.prompt<{ coverallsToken: string; }>({
    type: "input",
    name: "coverallsToken",
    message: "Coveralls token:",
    default: conf.get("coverallsToken")
  } as any).catch(() => ({ coverallsToken: undefined }));
  if(coverallsToken) {
    conf.set("coverallsToken", coverallsToken);
    return new (Coveralls as any).default(coverallsToken);
  } else {
    return undefined;
  }
}
