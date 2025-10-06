"""
Script de prueba para el endpoint PUT /api/docentes/{id}/
Demuestra casos de éxito y manejo de errores
"""

import requests
import json

# Base URL del API
BASE_URL = "http://localhost:8000/api"

def test_update_docente():
    """Prueba el endpoint PUT /docentes/{id}"""
    
    print("=== PRUEBAS DEL ENDPOINT PUT /docentes/{id} ===\n")
    
    # Test 1: Actualización exitosa
    print("1. Test de actualización exitosa:")
    docente_id = 1  # Asumiendo que existe un docente con ID 1
    
    datos_actualizacion = {
        "name": "Juan Carlos Pérez",
        "email": "juan.perez@mail.com",
        "telefono": "11-1234-5678",
        "domicilio": ".",
        "area": "Sistemas"
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/docentes/{docente_id}/",
            json=datos_actualizacion,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Actualización exitosa")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. ¿Está corriendo Django?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Docente no encontrado
    print("2. Test de docente no encontrado:")
    docente_inexistente = 9999
    
    try:
        response = requests.put(
            f"{BASE_URL}/docentes/{docente_inexistente}/",
            json=datos_actualizacion,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 404:
            print("✅ Error 404 manejado correctamente")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Código de estado inesperado: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. ¿Está corriendo Django?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        
    print("\n" + "="*50 + "\n")
    
    # Test 3: Datos inválidos
    print("3. Test de validación de datos:")
    datos_invalidos = {
        "email": "email-invalido",  # Email inválido
        "dni": "123",  # DNI muy corto
        "telefono": "abc123"  # Teléfono inválido
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/docentes/{docente_id}/",
            json=datos_invalidos,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 400:
            print("✅ Validación de datos funcionando correctamente")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Código de estado inesperado: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. ¿Está corriendo Django?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        
    print("\n" + "="*50 + "\n")
    
    # Test 4: Actualización parcial
    print("4. Test de actualización parcial:")
    datos_parciales = {
        "telefono": "11-9876-5432"
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/docentes/{docente_id}/",
            json=datos_parciales,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Actualización parcial exitosa")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. ¿Está corriendo Django?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def test_patch_docente():
    """Prueba el endpoint PATCH /docentes/{id}"""
    print("=== PRUEBA DEL ENDPOINT PATCH /docentes/{id} ===\n")
    
    docente_id = 1
    datos_patch = {
        "area": "Ingeniería de Software"
    }
    
    try:
        response = requests.patch(
            f"{BASE_URL}/docentes/{docente_id}/",
            json=datos_patch,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ PATCH exitoso")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. ¿Está corriendo Django?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def mostrar_ejemplos_curl():
    """Muestra ejemplos de comandos curl para probar el endpoint"""
    print("=== EJEMPLOS DE COMANDOS CURL ===\n")
    
    print("1. Actualización completa (PUT):")
    print("""curl -X PUT http://localhost:8000/api/docentes/1/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@mail.com",
    "telefono": "11-1234-5678",
    "domicilio": ".",
    "area": "Sistemas"
  }'""")
    
    print("\n2. Actualización parcial (PATCH):")
    print("""curl -X PATCH http://localhost:8000/api/docentes/1/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "telefono": "11-9876-5432"
  }'""")
    
    print("\n3. Test de docente no encontrado:")
    print("""curl -X PUT http://localhost:8000/api/docentes/9999/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Docente Inexistente"
  }'""")

if __name__ == "__main__":
    print("TESTS DEL ENDPOINT PUT /api/docentes/{id}")
    print("Asegúrate de que el servidor Django esté corriendo en localhost:8000")
    print("="*60 + "\n")
    
    # Ejecutar pruebas
    test_update_docente()
    test_patch_docente()
    mostrar_ejemplos_curl()
    
    print("\n" + "="*60)
    print("NOTA: Para ejecutar estas pruebas necesitas:")
    print("1. Tener el servidor Django corriendo: python manage.py runserver")
    print("2. Instalar requests: pip install requests")
    print("3. Tener al menos un docente en la base de datos con ID 1")