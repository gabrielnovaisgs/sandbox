import calculator_pb2
import calculator_pb2_grpc
import grpc
from concurrent import futures
import time
import functools


class AuthInterceptor(grpc.ServerInterceptor):
    def __init__(self, key, secret):
        self._key = key
        self._secret = secret


    def intercept_service(self, continuation, handler_call_details):
        metadata = dict(handler_call_details.invocation_metadata)
        token = metadata.get('auth-token')
        if token != self._secret:
            return self._abort_handler('Usuário não autenticado!')

        return continuation(handler_call_details)
    
    def _abort_handler(self, message):
        def terminate(request, context):
            context.abort(grpc.StatusCode.UNAUTHENTICATED, message)
        return grpc.unary_unary_rpc_method_handler(terminate)

def time_track(func):
    @functools.wraps(func)
    def wrapper(self, request, context):
        start_time = time.time()
        response = func(self, request, context)
        duration = time.time() - start_time

        print(f'[DURATION]: {str(duration)}')
        context.set_trailing_metadata([
            ('x-response-time', str(duration))
        ])
        return response
    return wrapper

            
class Calculator(calculator_pb2_grpc.CalculatorServicer):
    @time_track
    def Div(self, request, context):
        if request.second_number == 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, 'Não é possível dividir por zero!') # Realizando o tratamento de erros  
        result = request.first_number / request.second_number
        return calculator_pb2.CalcResponse(response=result) 
    
    @time_track
    def Multiply(self, request, context):
        result = request.first_number * request.second_number
        return calculator_pb2.CalcResponse(response=result) 
    
    @time_track
    def Sum(self, request, context):
        result = request.first_number + request.second_number
        return calculator_pb2.CalcResponse(response=result) 

    @time_track    
    def Sub(self, request, context):
        result = request.first_number - request.second_number
        return calculator_pb2.CalcResponse(response=result)
    
        
    
 
          
    
    
def serve():
    auth_interceptor = AuthInterceptor(key='auth-token', secret='secret')
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        interceptors=(auth_interceptor,)
        )
    calculator_pb2_grpc.add_CalculatorServicer_to_server(Calculator(), server)
    server.add_insecure_port('[::]:50051')
    print("Servidor gRPC rodando na porta 50051")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()