from rest_framework.response import Response

def success_response(data, message="Operación exitosa", status_code=200):
    return Response({
        'success': True,
        'message': message,
        'data': data
    }, status=status_code)

def error_response(error, message="Error en la solicitud", status_code=400):
    return Response({
        'success': False,
        'message': message,
        'error': error
    }, status=status_code)
