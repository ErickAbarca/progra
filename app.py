from flask import Flask, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS
import logging
import pyodbc

app = Flask(__name__)
CORS(app) 

logging.basicConfig(level=logging.DEBUG)

def ejecutar_stored_procedure(nombre_sp, parametros=None):
    # Configuración de la conexión a la base de datos
    server = 'ERICKPC'
    database = 'repuestos'
    username = 'hola'
    password = '12345678'
    conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    try:
        if parametros:
            cursor.execute(f"EXEC {nombre_sp} {parametros}")
        else:
            cursor.execute(f"EXEC {nombre_sp}")

        if cursor.description:
            resultados = cursor.fetchall()
            return resultados
        else:
            return None
    finally:
        cursor.close()
        conn.close()

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/validar', methods=['GET'])
def validar_credenciales():
    username = request.args.get('username')
    password = request.args.get('password')

    resultado = ejecutar_stored_procedure('ValidarCredenciales', f"'{username}', '{password}'")

    if resultado[0][0] == 'Usuario válido':
        return redirect(url_for('pagina_principal'))
    else:
        return jsonify({'error': 'Usuario inválido'}), 401

@app.route('/api/olvidar', methods=['GET'])
def olvidar():
    return render_template('olvidar.html')

@app.route('/cambiar', methods=['POST'])
def cambiar():
    username = request.args.get('username')
    new_password = request.args.get('password')

    server = 'ERICKPC'
    database = 'repuestos'
    username = 'hola'
    password = '12345678'
    conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"EXEC CambiarContrasena '{username}', '{new_password}'")
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Contraseña cambiada exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/principal')
def pagina_principal():
    return render_template('index.html')

@app.route('/api/vehiculos', methods=['GET'])
def obtener_vehiculos():
    try:
        resultados = ejecutar_stored_procedure('SP_ObtenerVehiculos')
        if resultados:
            vehiculos = []
            for fila in resultados:
                vehiculo = {
                    'marca': fila[0],
                    'modelo': fila[1],
                    'anio': fila[2],
                    'estilo': fila[3],
                    'trans': fila[4],
                    'placa': fila[5],
                    'color': fila[6],
                    'combustible': fila[7],
                    'cilindrada': fila[8],
                    'pasajeros': fila[9],
                    'puertas': fila[10],
                    'estado': fila[11]
                }
                vehiculos.append(vehiculo)
            return jsonify(vehiculos), 200
        else:
            return jsonify({"message": "No se encontraron vehículos"}), 404
    except Exception as e:
        app.logger.error(f"Error obteniendo vehículos: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


#recibe datos en formato json
@app.route('/api/modificar_vehiculo', methods=['POST'])
def modificar_vehiculo():
    datos = request.json
    try:
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        estilo = datos.get('estilo')
        anio = int(datos.get('anio'))
        trans = datos.get('trans')
        estado = int(datos.get('estado'))
        color = datos.get('color')
        combustible = datos.get('combustible')
        cilindrada = int(datos.get('cilindrada'))
        pasajeros = int(datos.get('pasajeros'))
        puertas = int(datos.get('puertas'))
        placa = datos.get('placa')

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC ModificarVehiculo '{marca}', '{modelo}', '{estilo}', {anio},'{trans}',{estado},'{color}','{combustible}',{cilindrada},{pasajeros},{puertas},'{placa}'")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "No se encontraron vehículos"}), 404
    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400


@app.route('/api/vehiculos/eliminar', methods=['POST'])
def eliminar_vehiculo():
    datos = request.json
    logging.debug(f"Datos recibidos: {datos}")

    placa = datos.get('placa')

    try: 
        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC EliminarVehiculo '{placa}'")
        conn.commit()
        cursor.close()
        conn.close()
        
        if cursor.description:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "No se encontraron vehículos"}), 404

    except Exception as e:
        logging.exception("Excepción al ejecutar el procedimiento almacenado.")
        return jsonify({"error": str(e)}), 500

@app.route('/api/vehiculos/insertar', methods=['POST'])
def insertar_vehiculo():
    datos = request.json
    try:
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        estilo = datos.get('estilo')
        anio = int(datos.get('anio'))
        trans = datos.get('trans')
        estado = int(datos.get('estado'))
        color = datos.get('color')
        combustible = datos.get('combustible')
        cilindrada = int(datos.get('cilindrada'))
        pasajeros = int(datos.get('pasajeros'))
        puertas = int(datos.get('puertas'))
        placa = datos.get('placa')

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC AgregarVehiculo '{marca}', '{modelo}', '{estilo}', {anio}, '{trans}', '{placa}', {estado}, '{color}', '{combustible}', {cilindrada}, {pasajeros}, {puertas}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "No se encontraron vehículos"}), 404
        

    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400

@app.route('/api/repuestos', methods=['GET'])
def obtener_repuestos():
    try:
        resultados = ejecutar_stored_procedure('SP_ObtenerRepuestos')
        if resultados:
            repuestos = []
            for fila in resultados:
                repuesto = {
                    'codigo': fila[0],
                    'nombre': fila[1],
                    'marca': fila[2],
                    'modelo': fila[3],
                    'cantidad': fila[4],
                    'anio': fila[5],
                }
                repuestos.append(repuesto)
            return jsonify(repuestos), 200
        else:
            return jsonify({"message": "No se encontraron repuestos"}), 404
    except Exception as e:
        app.logger.error(f"Error obteniendo repuestos: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/api/repuestos/modificar', methods=['POST'])
def modificar_repuesto():
    datos = request.json
    try:
        codigo = int(datos.get('codigo'))
        nombre = datos.get('nombre')
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        cantidad = int(datos.get('cantidad'))
        anio = int(datos.get('anio'))

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC ModificarRepuesto {codigo}, '{nombre}', '{marca}', '{modelo}', {anio}, {cantidad}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 404
        else:
            return jsonify({"message": "Repuesto Modificado Exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400
    
@app.route('/api/repuestos/eliminar', methods=['POST'])
def eliminar_repuesto():
    datos = request.json
    logging.debug(f"Datos recibidos: {datos}")

    codigo = datos.get('codigo')

    try: 
        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC EliminarRepuesto {codigo}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()
        
        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 400
        else:
            return jsonify({"message": "Repuesto Eliminado"}), 200

    except Exception as e:
        logging.exception("Excepción al ejecutar el procedimiento almacenado.")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/repuestos/insertar', methods=['POST'])
def insertar_repuesto():
    datos = request.json
    try:
        nombre = datos.get('nombre')
        marca = datos.get('marca')
        modelo = datos.get('modelo')
        cantidad = int(datos.get('cantidad'))
        anio = int(datos.get('anio'))
        codigo = int(datos.get('codigo'))

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC AgregarRepuesto {codigo},'{nombre}', '{marca}', {anio}, '{modelo}', {cantidad}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "Repuesto Insertado Exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400

@app.route('/api/clientes', methods=['GET'])
def obtener_clientes():
    try:
        resultados = ejecutar_stored_procedure('obtenerclientes')
        if resultados:
            clientes = []
            for fila in resultados:
                cliente = {
                    'id': fila[0],
                    'nombre': fila[1],
                    'correo': fila[2],
                    'direccion': fila[3]
                }
                clientes.append(cliente)
            return jsonify(clientes), 200
        else:
            return jsonify({"message": "No se encontraron clientes"}), 404
    except Exception as e:
        app.logger.error(f"Error obteniendo clientes: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/api/clientes/modificar', methods=['POST'])
def modificar_cliente():
    datos = request.json
    try:
        idCliente = int(datos.get('idCliente'))
        nombre = datos.get('nombre')
        correo = datos.get('correo')
        direccion = datos.get('direccion')

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC modificarClientes '{nombre}', '{correo}', '{direccion}', {idCliente}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "Cliente Modificado Exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400

@app.route('/api/clientes/eliminar', methods=['POST'])
def eliminar_cliente():
    datos = request.json
    logging.debug(f"Datos recibidos: {datos}")

    idCliente = datos.get('idCliente')

    try: 
        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC eliminarCliente {idCliente}")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()
        
        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "Cliente Eliminado"}), 200

    except Exception as e:
        logging.exception("Excepción al ejecutar el procedimiento almacenado.")
        return jsonify({"error": str(e)}), 500


@app.route('/api/clientes/insertar', methods=['POST'])
def insertar_cliente():
    datos = request.json
    try:
        nombre = datos.get('nombre')
        correo = datos.get('correo')
        direccion = datos.get('direccion')

        server = 'ERICKPC'
        database = 'repuestos'
        username = 'hola'
        password = '12345678'
        conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute(f"EXEC Agregar_cliente '{nombre}', '{correo}', '{direccion}'")
        conn.commit()
        des = cursor.description
        cursor.close()
        conn.close()

        if des:
            resultados = cursor.fetchall()
            return jsonify(resultados), 200
        else:
            return jsonify({"message": "Cliente Insertado Exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400

@app.route('/api/opciones', methods=['GET'])
def opciones():
    sps = ['ObtenerMarcas', 'ObtenerTrans', 'ObtenerEstilo', 'ObtenerCombustible']
    resultado = []
    for s in sps:
        resultados = ejecutar_stored_procedure(s)
        if resultados:
            subres = [fila[0] for fila in resultados]
            resultado.append(subres)
        else:
            resultado.append([])
    return jsonify(resultado), 200



if __name__ == '__main__':
    app.run(debug=True)