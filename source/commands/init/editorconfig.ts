import clee, { parseString } from "clee";
import join from "join-newlines";
import { structure } from "../../structure.js";

export const initEditorconfig = clee("editorconfig")
  .description("Initialize a .editorconfig file")
  .option("-c", "--cwd", "[path]", "Path to root of the package", parseString)
  .action(async (options) => {
    structure(options.cwd).files().editorConfig.write(join([
      "root = true",
      "",
      "[*]",
      "indent_style = space",
      "indent_size = 2",
      "end_of_line = lf",
      "charset = utf-8",
      "trim_trailing_whitespace = true",
      "insert_final_newline = true"
    ]));
  });
