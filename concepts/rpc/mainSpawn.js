#! /bin/node

import { spawn } from "node:child_process";
const PYTHON_PATH = "/bin/python3";

const args = process.argv.slice(2);

//Exemplo com spawn, trabalha com stream de dados
const mainStream = spawn(PYTHON_PATH, ["./main.py", ...args]);

let count = 0;
mainStream.stdout.on("data", (data) => {
  console.log(`LOG[${count}] - ${data}`);
  count++;
});

mainStream.stderr.on("data", (error) => console.log(error));
