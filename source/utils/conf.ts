import Conf from "conf";

export function getConf() {
  return new Conf({ projectName: "autorepo" });
}
