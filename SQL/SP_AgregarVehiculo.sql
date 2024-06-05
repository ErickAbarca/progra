-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.AgregarVehiculo
    @nombreMarca VARCHAR (42),
    @modelo VARCHAR (42),
    @estilo VARCHAR (42),
    @año INT,
    @transmision VARCHAR (42),
    @placa VARCHAR (16),
    @estado VARCHAR (42),
    @color VARCHAR (16),
    @combustible VARCHAR (42),
    @cilindrada INT,
    @numeroPasajeros INT,
    @numeroPuertas INT
AS
BEGIN
    -- Verificación de existencia de la marca ingresada en la tabla 'Marcas'
    -- Si la marca no existe, el marcaID será NULL. Si existe tiene el ID de la marca
    DECLARE @marcaID INT
    SELECT @marcaID = idMarca
        FROM Marca AS M
    WHERE @nombreMarca = nombre

    -- Inserta el nombre de la marca y obtenemos el id de la marca
    IF @marcaID IS NULL 
    BEGIN
        INSERT INTO Marca (nombre)
        VALUES (@nombreMarca)

        SET @marcaID = SCOPE_IDENTITY () -- Obtenemos el id de la marca recien insertada
    END

    -- Verificación de existencia de la estilo ingresado en la tabla 'Estilo'
    -- Si el estilo no existe, el estiloID será NULL. Si existe tiene el ID de la estilo
    DECLARE @estiloID INT
    SELECT @estiloID = idEstilo
        FROM Estilo AS E
    WHERE @estilo = nombre

    -- Inserta el nombre del estilo y obtenemos el id de la estilo
    IF @estiloID IS NULL 
    BEGIN
        INSERT INTO Estilo (nombre)
        VALUES (@estilo)

        SET @estiloID = SCOPE_IDENTITY () -- Obtenemos el id de la estilo recien insertada
    END

    -- Verificación de existencia de la transmision ingresada en la tabla 'Transmision'
    -- Si la transmision no existe, el ta será NULL. Si existe tiene el ID de la transmision
    DECLARE @TransmisionID INT
    SELECT @TransmisionID = idTransmision
        FROM Transmision AS T
    WHERE @Transmision = nombre

    -- Inserta el nombre del transmision y obtenemos el id de la transmision
    IF @TransmisionID IS NULL 
    BEGIN
        INSERT INTO Transmision (nombre)
        VALUES (@Transmision)

        SET @TransmisionID= SCOPE_IDENTITY () -- Obtenemos el id de la transmision recien insertada
    END

    -- Verificación de existencia del combustible ingresada en la tabla 'Combustible'
    -- Si el combustible no existe, el id será NULL. Si existe tiene el ID de la combustible
    DECLARE @combustibleID INT
    SELECT @combustibleID = idCombustible
        FROM Combustible AS C
    WHERE @combustible = nombre

    -- Inserta el nombre del combustible y obtenemos el id de la combustible
    IF @combustibleID IS NULL 
    BEGIN
        INSERT INTO Combustible (nombre)
        VALUES (@combustible)

        SET @combustibleID = SCOPE_IDENTITY () -- Obtenemos el id de la transmision recien insertada
    END

    IF @estado = 'Activo'
    BEGIN
        SET @estado = 1
    END
    ELSE
    BEGIN
        SET @estado = 0
    END

    -- Verifica si el vehiculo ya existe en la tabla 'Vehiculo'
    DECLARE @vehiculoID INT
    SELECT @vehiculoID = V.idVehiculo
        FROM Vehiculo AS V
    WHERE @marcaID = V.idMarca AND @estiloID = V.idEstilo AND @año = V.año AND @TransmisionID = V.idTransmision
    AND @placa = V.placa AND @estado = V.estado AND @color = V.color AND @combustibleID = V.idCombustible AND
    @cilindrada = V.cilindrada AND @numeroPasajeros = V.numeroPasajeros AND @numeroPuertas = V.numeroPuertas AND @modelo = V.modelo

    -- Si el Vehiculo no existe, entonces lo inserta en la tabla 'Vehiculo'
    IF @vehiculoID IS NULL 
    BEGIN
        INSERT INTO Vehiculo
            (idMarca, idEstilo, año, idTransmision, placa, estado, color, idCombustible, cilindrada, numeroPasajeros, numeroPuertas, modelo) VALUES
            (@marcaID, @estiloID, @año, @TransmisionID, @placa, @estado, @color, @combustibleID, @cilindrada, @numeroPasajeros, @numeroPuertas, @modelo)
        RETURN 0 -- Indica que el repuesto no existía y se ha insertado
    END
    ELSE
    BEGIN
        RETURN 1 -- Indica que el repuesto ya existía
    END
END
GO