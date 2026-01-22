import calculator_pb2
import calculator_pb2_grpc
import grpc
from concurrent import futures
class Calculator(calculator_pb2_grpc.CalculatorServicer):
    def Multiply(self, request, context):
        result = request.first_number * request.second_number

        return calculator_pb2.CalcResponse(response=result) 
    
    def Div(self, request, context):
        if request.second_number == 0:
            result = 0
        else:
            result = request.first_number / request.second_number
        return calculator_pb2.CalcResponse(response=result) 
    
    def Sum(self, request, context):
        result = request.first_number + request.second_number
        return calculator_pb2.CalcResponse(response=result) 
    
    def Sub(self, request, context):
        result = request.first_number - request.second_number
        return calculator_pb2.CalcResponse(response=result) 
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calculator_pb2_grpc.add_CalculatorServicer_to_server(Calculator(), server)
    server.add_insecure_port('[::]:50051')
    print("Servidor gRPC rodando na porta 50051")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()