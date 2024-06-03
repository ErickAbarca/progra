ALTER PROCEDURE SP_ObtenerVehiculos
AS
BEGIN
    SELECT 
        M.nombre AS [Nombre de la marca],
        V.modelo AS [Modelo del vehículo],
        V.año AS [Año del vehículo],
        E.nombre AS [Nombre del Estilo],
        T.nombre AS [Tipo de transmision],
        V.placa AS [Placa del vehículo],
        V.color AS [Color del vehículo],
        C.nombre AS [Tipo de combustible],
        V.cilindrada AS [Cilindrada del vehículo],
        V.numeroPasajeros AS [Número de pasajeros],
        V.numeroPuertas AS [Número de puertas],
        V.estado AS [Estado del vehiculo]


    FROM Vehiculo AS V
        INNER JOIN Marca AS M ON V.idMarca = M.idMarca
        INNER JOIN Estilo AS E ON V.idEstilo = E.idEstilo
        INNER JOIN Transmision AS T ON V.idTransmision = T.idTransmision
        INNER JOIN Combustible AS C ON V.idCombustible = C.idCombustible
END
GO