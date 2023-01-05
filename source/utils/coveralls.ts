import Coveralls from "coveralls-api";
import enquirer from "enquirer";
import { getConf } from "./conf.js";

export async function getCoveralls() {
  const conf = getConf();
  const answers = await enquirer.prompt<{ coverallsToken: string; }>({
    type: "input",
    name: "coverallsToken",
    message: "Coveralls token:",
    default: conf.get("coverallsToken")
  } as any);
  conf.set("coverallsToken", answers.coverallsToken);
  if(answers.coverallsToken) {
    return new Coveralls(answers.coverallsToken);
  } else {
    return undefined;
  }
}
