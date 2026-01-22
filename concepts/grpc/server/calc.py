import calculator_pb2
import calculator_pb2_grpc
import grpc
from concurrent import futures
import time
class Calculator(calculator_pb2_grpc.CalculatorServicer):
    def Div(self, request, context):
        start_time = time.time()
        self.check_grpc_auth(context)
        if request.second_number == 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, 'Não é possível dividir por zero!') # Realizando o tratamento de erros
            duration = time.time() - start_time
            context.set_trailing_metadata([
                    ('x-response-time', str(duration))
                ])

        result = request.first_number / request.second_number
        duration = time.time() - start_time
        context.set_trailing_metadata([
            ('x-response-time', str(duration))
        ])

        return calculator_pb2.CalcResponse(response=result) 
    
    def Multiply(self, request, context):
        start_time = time.time()
        self.check_grpc_auth(context)
        result = request.first_number * request.second_number
        duration = time.time() - start_time
        context.set_trailing_metadata([
            ('x-response-time', str(duration))
        ])

        return calculator_pb2.CalcResponse(response=result) 
    
    def Sum(self, request, context):
        self.check_grpc_auth(context)
        result = request.first_number + request.second_number
        return calculator_pb2.CalcResponse(response=result) 
        
    def Sub(self, request, context):
        self.check_grpc_auth(context)
        result = request.first_number - request.second_number
        return calculator_pb2.CalcResponse(response=result)
    
    def check_grpc_auth(self, context):
        metadata = dict(context.invocation_metadata())
        token = metadata.get('auth-token')
        if token != 'secret':
            context.abort(grpc.StatusCode.UNAUTHENTICATED, 'Usuário não autenticado!')
        return metadata
    
    def time_check(func):
        def wrapper():
            
            func()
            
          
    
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calculator_pb2_grpc.add_CalculatorServicer_to_server(Calculator(), server)
    server.add_insecure_port('[::]:50051')
    print("Servidor gRPC rodando na porta 50051")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()