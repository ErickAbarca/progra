ALTER PROCEDURE SP_ObtenerVehiculos
AS
BEGIN
    SET NOCOUNT ON
    SELECT 
        M.nombre,
        V.modelo,
        V.año,
        E.nombre,
        T.nombre,
        V.placa,
        V.color,
        C.nombre,
        V.cilindrada,
        V.numeroPasajeros,
        V.numeroPuertas,
        V.estado


    FROM Vehiculo AS V
        INNER JOIN Marca AS M ON V.idMarca = M.idMarca
        INNER JOIN Estilo AS E ON V.idEstilo = E.idEstilo
        INNER JOIN Transmision AS T ON V.idTransmision = T.idTransmision
        INNER JOIN Combustible AS C ON V.idCombustible = C.idCombustible
    
    SET NOCOUNT OFF
END
GO