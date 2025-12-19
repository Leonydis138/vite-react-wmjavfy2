export function pipe(input, commands) {
  return commands.reduce((data, cmd) => {
    return cmd(data);
  }, input);
}
