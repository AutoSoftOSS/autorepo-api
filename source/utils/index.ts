import { Readable } from "node:stream";
import { Repository } from "types-pkg-json";

export function parsePackageName(name?: string) {
  const split = name?.split("/").reverse() ?? [];
  return {
    name: split[0],
    org: split[1]
  };
}

export function parseRepositoryURL(repository?: Repository) {
  const url = typeof repository === "string" ? repository : repository?.url;
  const split = url?.replace(".git", "").split("/").reverse() ?? [];
  if(split.length > 2) {
    return {
      owner: split[1],
      repo: split[0]
    };
  } else {
    return undefined;
  }
}

export function streamToBuffer(readStream: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    let buffer = Buffer.from([]);
    // Read data from the read stream into the buffer
    readStream.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
    });
    readStream.on("end", () => {
      resolve(buffer);
    });
    readStream.on("error", reject);
  });
}

export function bufferToStream(buffer: Buffer) {
  const readStream = new Readable();
  readStream.push(buffer);
  readStream.push(null);
  return readStream;
}

export async function streamToString(readStream: Readable) {
  return streamToBuffer(readStream).then((buffer) => buffer.toString());
}

export * from "./github.js";
export * from "./git.js";
export * from "./changelog.js";
