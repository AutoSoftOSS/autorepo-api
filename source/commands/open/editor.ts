import clee from "clee";
import open from "open-editor";
import { structure } from "../../structure.js";

export const openEditor = clee("editor")
  .description("Open the project in an editor")
  .argument("[editor]", "The name of the editor to open the repository in")
  .action(async (editor) => {
    const root = structure().path;
    open([root], {
      editor: editor ?? "vscode"
    });
  });
