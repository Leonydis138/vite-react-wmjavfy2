import { fs } from "../fs/VirtualFS";

export function execute(input) {
  const [cmd, ...args] = input.trim().split(" ");

  switch (cmd) {
    case "ls":
      return fs.list("/");
    case "echo":
      return [args.join(" ")];
    case "pwd":
      return ["/"];
    case "help":
      return ["ls, echo, pwd"];
    default:
      return [`Command not found: ${cmd}`];
  }
}
