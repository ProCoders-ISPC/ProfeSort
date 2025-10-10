import requests
import json

url = "http://localhost:8000/usuarios/login/"
data = {
    "email": "admin@profesort.com",
    "password": "Admin123456"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ Login exitoso!")
        print(json.dumps(response.json(), indent=2))
    else:
        print("\n❌ Error en login")
        
except Exception as e:
    print(f"❌ Error de conexión: {e}")
