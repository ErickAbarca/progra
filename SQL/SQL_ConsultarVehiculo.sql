-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.ConsultarVehiculo
    @nombreMarca VARCHAR (42),
    @modelo INT,
    @año INT,
    @estilo VARCHAR (42)
-- add more stored procedure parameters here
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
        V.numeroPuertas AS [Número de puertas]

    FROM Vehiculo AS V
        INNER JOIN Marca AS M ON V.idMarca = M.idMarca
        INNER JOIN Estilo AS E ON V.idEstilo = E.idEstilo
        INNER JOIN Transmision AS T ON V.idTransmision = T.idTransmision
        INNER JOIN Combustible AS C ON V.idCombustible = C.idCombustible
    WHERE  
        @nombreMarca = M.nombre AND
        @año = V.año AND
        @modelo = V.modelo AND
        @estilo = E.idEstilo
END
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.ConsultarVehiculo 'Toyota', 1, 2021, 2
GO