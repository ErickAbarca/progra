ALTER PROCEDURE SP_Filtro
    @tabla VARCHAR(50),
    @campo VARCHAR(50),
    @valor VARCHAR(50), 
    @tipo VARCHAR(50)
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX);
    DECLARE @ParamDef NVARCHAR(MAX);
    DECLARE @ConvertedValue NVARCHAR(50);

    -- Convertir nombre a id correspondiente si es necesario
    IF @campo = 'Marca'
    BEGIN
        SELECT @ConvertedValue = CAST(idMarca AS NVARCHAR) FROM Marca WHERE nombre = @valor;
        SET @campo = 'idMarca';
    END
    ELSE IF @campo = 'Estilo'
    BEGIN
        SELECT @ConvertedValue = CAST(idEstilo AS NVARCHAR) FROM Estilo WHERE nombre = @valor;
        SET @campo = 'idEstilo';
    END
    ELSE IF @campo = 'Transmision'
    BEGIN
        SELECT @ConvertedValue = CAST(idTransmision AS NVARCHAR) FROM Transmision WHERE nombre = @valor;
        SET @campo = 'idTransmision';
    END
    ELSE IF @campo = 'Combustible'
    BEGIN
        SELECT @ConvertedValue = CAST(idCombustible AS NVARCHAR) FROM Combustible WHERE nombre = @valor;
        SET @campo = 'idCombustible';
    END
    ELSE
    BEGIN
        SET @ConvertedValue = '%' + @valor + '%';
    END

    -- Construir la consulta según la tabla
    IF @tabla = 'Cliente'
    BEGIN
        SET @SQL = N'SELECT * FROM Cliente WHERE ' + QUOTENAME(@campo) + ' LIKE @ConvertedValue';
        SET @ParamDef = N'@ConvertedValue NVARCHAR(50)';
    END
    ELSE IF @tabla = 'Vehiculo'
    BEGIN
        SET @SQL = N'
            SELECT 
                M.nombre AS Marca,
                V.modelo,
                V.año,
                E.nombre AS Estilo,
                T.nombre AS Transmision,
                V.placa,
                V.color,
                C.nombre AS Combustible,
                V.cilindrada,
                V.numeroPasajeros,
                V.numeroPuertas,
                V.estado
            FROM Vehiculo AS V
                INNER JOIN Marca AS M ON V.idMarca = M.idMarca
                INNER JOIN Estilo AS E ON V.idEstilo = E.idEstilo
                INNER JOIN Transmision AS T ON V.idTransmision = T.idTransmision
                INNER JOIN Combustible AS C ON V.idCombustible = C.idCombustible
            WHERE V.' + QUOTENAME(@campo) + ' LIKE @ConvertedValue';
        SET @ParamDef = N'@ConvertedValue NVARCHAR(50)';
    END
    ELSE IF @tabla = 'Repuesto'
    BEGIN
        SET @SQL = N'
            SELECT
                R.idRepuesto,
                R.nombre,
                M.nombre AS Marca,
                R.modelo,
                R.cantidad,
                R.año
            FROM Repuesto AS R
                INNER JOIN Marca AS M ON R.idMarca = M.idMarca
            WHERE R.' + QUOTENAME(@campo) + ' LIKE @ConvertedValue';
        SET @ParamDef = N'@ConvertedValue NVARCHAR(50)';
    END
    ELSE
    BEGIN
        RAISERROR('Tabla no soportada.', 16, 1);
        RETURN;
    END

    -- Ajustar el parámetro según el tipo especificado
    IF @tipo = 'int'
    BEGIN
        SET @ConvertedValue = '%' + CAST(@valor AS NVARCHAR) + '%';
        SET @ParamDef = N'@ConvertedValue NVARCHAR(50)';
    END
    
    -- Ejecutar la consulta dinámica
    EXEC sp_executesql @SQL, @ParamDef, @ConvertedValue = @ConvertedValue;
END
GO