import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { randomUUID } from "node:crypto";

const PROTO_PATH = "../calculator.proto";

async function main() {
  const { command, data } = getCommandCli();
  const { client, metadata } = configGrpcClient("secret");

  const COMMANDS = {
    div: () => execCommand(client, "Div", data, metadata),
    sum: () => execCommand(client, "Sum", data, metadata),
    mul: () => execCommand(client, "Multiply", data, metadata),
    sub: () => execCommand(client, "Sub", data, metadata),
  };

  if (!COMMANDS[command]) {
    console.error("Comando inválido!");
    return;
  }
  const result = await COMMANDS[command]();
  printServerResult(result.err, result.response, result.metadata);
}

function getCommandCli() {
  const args = process.argv.slice(2);
  return {
    command: args[0],
    data: {
      first_number: args[1],
      second_number: parseFloat(args[2]),
    },
  };
}

async function execCommand(client, commandClient, data, metadata) {
  const result = await new Promise((resolve, reject) => {
    let finalResponse;
    const call = client[commandClient](data, metadata, (err, response) => {
      if (err) return reject(err);

      finalResponse = response;
    });

    call.on("status", (status) => {
      resolve({
        ...finalResponse,
        metadata: status.metadata.getMap(),
      });
    });
  });
  return result;
}

function configGrpcClient(token) {
  // Carregamos as definições do arquivo
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  // Carregamos as deginições que realizamos do pacote em memória
  const calculatorProto = grpc.loadPackageDefinition(packageDefinition);
  // adicionando metadados
  const metadata = new grpc.Metadata();
  metadata.add("auth-token", token);
  metadata.add("request-id", randomUUID());
  const client = new calculatorProto.Calculator(
    "localhost:50051",
    grpc.credentials.createInsecure(),
  );
  return { client, metadata };
}

function printServerResult(err, response, metadata) {
  if (err) {
    console.log(`[ERROR]: ${err.details}`);
    console.log(`[STATUS]: ${err.code}`);
    return;
  }
  console.log(`[RESULT]:`, response);
  console.log(`[METADATA]: `, metadata);
}

main();
