import join from "join-newlines";
import enquirer from "enquirer";

export async function installation(packageName?: string) {
  if(packageName) {
    // Prompt for install flag
    const { install } = await enquirer.prompt<{ install: boolean; }>({
      type: "confirm",
      name: "install",
      message: "Would you like to include an installation section in the README?",
      initial: true
    });
    if(install) {
      // Ask if it is a dev dependency or normal dependency
      const { dev } = await enquirer.prompt<{ dev: boolean; }>({
        type: "confirm",
        name: "dev",
        message: "Is this a development dependency?",
        initial: false
      });
      return {
        raw: join([
          "<!-- auto installation start -->",
          "## Installation",
          "",
          "```sh",
          `yarn add ${dev ? "--dev " : ""}${packageName}`,
          "```",
          "",
          "```sh",
          `npm install ${dev ? "--save-dev " : ""}${packageName}`,
          "```",
          "",
          "```sh",
          `pnpm add ${dev ? "--save-dev " : ""}${packageName}`,
          "```",
          "<!-- auto installation end -->",
          ""
        ])
      }
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}
