import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "../calculator.proto";
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

const client = new calculatorProto.Calculator(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

const args = process.argv.slice(2);

const data = {
  first_number: args[1],
  second_number: parseFloat(args[2]),
};

const commands = {
  div: () => client.Div(data, printServerResult),
  sum: () => client.Sum(data, printServerResult),
  mul: () => client.Multiply(data, printServerResult),
  sub: () => client.Sub(data, printServerResult),
};

commands[args[0]]();

function printServerResult(err, response) {
  if (err) {
    console.log(`[ERROR]: ${err}`);
  }

  console.log(`[RESULT]:`, response);
}
