#! /bin/node

import { exec } from "node:child_process";
const PYTHON_PATH = "/bin/python3";

const args = process.argv.slice(2);
const command = `${PYTHON_PATH} ${"./main.py"} ${args[0]} ${args[1]}`;

//Exemplo com exec, executa todo o processo de uma vez
exec(command, (err, stdout, srderr) => {
  if (err) {
    console.log(srderr);
  }
  console.log(`result: ${stdout}`);
});
