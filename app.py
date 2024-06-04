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
            # Construir la cadena de parámetros
            sql_query = f"EXEC {nombre_sp} {parametros}"
            logging.debug(f"SQL Query: {sql_query}")
            cursor.execute(sql_query)
        else:
            sql_query = f"EXEC {nombre_sp}"
            logging.debug(f"SQL Query: {sql_query}")
            cursor.execute(sql_query)

        if cursor.description:
            resultados = cursor.fetchall()
            columnas = [column[0] for column in cursor.description]
            return resultados, columnas
        else:
            return None, None
    except pyodbc.Error as e:
        logging.error(f"Error ejecutando el procedimiento almacenado: {e}")
        raise
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
        return redirect(url_for('principal'))
    else:
        return jsonify({'error': 'Usuario inválido'}), 401

@app.route('/principal')
def pagina_principal():
    return render_template('index.html')

@app.route('/api/vehiculos', methods=['GET'])
def obtener_vehiculos():
    try:
        resultados, columnas = ejecutar_stored_procedure('SP_ObtenerVehiculos')
        if resultados:
            vehiculos = []
            for fila in resultados:
                vehiculo = {
                    'marca': fila[columnas.index('Nombre de la marca')],
                    'modelo': fila[columnas.index('Modelo del vehículo')],
                    'anio': fila[columnas.index('Año del vehículo')],
                    'estilo': fila[columnas.index('Nombre del Estilo')],
                    'trans': fila[columnas.index('Tipo de transmision')],
                    'placa': fila[columnas.index('Placa del vehículo')],
                    'color': fila[columnas.index('Color del vehículo')],
                    'combustible': fila[columnas.index('Tipo de combustible')],
                    'cilindrada': fila[columnas.index('Cilindrada del vehículo')],
                    'pasajeros': fila[columnas.index('Número de pasajeros')],
                    'puertas': fila[columnas.index('Número de puertas')],
                    'estado': fila[columnas.index('Estado del vehiculo')]
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
        anio = datos.get('anio')
        trans = datos.get('trans')
        estado = datos.get('estado')
        color = datos.get('color')
        combustible = datos.get('combustible')
        cilindrada = datos.get('cilindrada')
        pasajeros = datos.get('pasajeros')
        puertas = datos.get('puertas')
        placa = datos.get('placa')

        parametros = f"'{marca}', '{modelo}', '{estilo}', {anio},'{trans}',{estado},'{color}','{combustible}',{cilindrada},{pasajeros},{puertas},'{placa}'"
        logging.debug(f"Parámetros: {parametros}")
        resultados, columnas = ejecutar_stored_procedure('dbo.ModificarVehiculo', parametros)
        if resultados is None or len(resultados) == 0:
            logging.info("Vehículo modificado exitosamente.")
        else:
            logging.error("Error en la ejecución del procedimiento almacenado: resultados no vacíos.")
        return jsonify({"message": "Vehículo modificado exitosamente"}), 200


    except Exception as e:
        logging.exception("Error al obtener los datos del request.")
        return jsonify({"error": "Datos inválidos"}), 400


@app.route('/api/vehiculos/eliminar', methods=['POST'])
def eliminar_vehiculo():
    datos = request.json
    logging.debug(f"Datos recibidos: {datos}")

    placa = datos.get('placa')
    if not placa:
        logging.error("El campo 'placa' es obligatorio.")
        return jsonify({"error": "El campo 'placa' es obligatorio"}), 400

    parametros = {
        'placa': placa
    }

    try:
        resultados, columnas = ejecutar_stored_procedure('dbo.EliminarVehiculo', parametros)
        if resultados is None or len(resultados) == 0:
            logging.info("Vehículo eliminado exitosamente.")
            return jsonify({"message": "Vehículo eliminado exitosamente"}), 200
        else:
            logging.error("Error en la ejecución del procedimiento almacenado: resultados no vacíos.")
            return jsonify({"error": "Error eliminando el vehículo"}), 500
    except Exception as e:
        logging.exception("Excepción al ejecutar el procedimiento almacenado.")
        return jsonify({"error": str(e)}), 500


@app.route('/api/repuestos/insertar', methods=['GET'])
def abrir_formulario_repuestos():
    return render_template('insertarRep.html')

@app.route('/api/opciones', methods=['GET'])
def opciones():
    sps = ['ObtenerMarcas', 'ObtenerTrans', 'ObtenerEstilo', 'ObtenerCombustible']
    resultado = []
    for s in sps:
        resultados, columnas = ejecutar_stored_procedure(s)
        if resultados:
            subres = [fila[0] for fila in resultados]
            resultado.append(subres)
        else:
            resultado.append([])
    return jsonify(resultado), 200



if __name__ == '__main__':
    app.run(debug=True)