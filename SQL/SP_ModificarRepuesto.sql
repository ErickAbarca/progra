-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.ModificarRepuesto
    /* Note que se ocupa los datos anteriores para así
    cambiarlo a partir de la busqueda
    Utilizar el SP_ConsultarRepuesto */

    @nombreRepuesto VARCHAR (50),
    @nombreRepuestoPasado VARCHAR (50),
    @nombreMarca VARCHAR (42),
    @nombreMarcaPasado VARCHAR (42),
    @modelo INT,
    @modeloPasado INT,
    @año INT,
    @añoPasado INT,
    @cantidad INT,
    @cantidadPasado INT

AS
BEGIN

    -- Se busca si la marca nueva a cambiar ya esta en la tabla
    DECLARE @idMarca INT
    DECLARE @idMarcaParaCambiar INT

    SELECT @idMarca = M.idMarca
    FROM Marca AS M
    WHERE M.nombre = @nombreMarca

    -- Si existe la marca no sera NULL, si no si sera NULL
    IF @idMarca IS NOT NULL
        BEGIN --Simplemente se toma el idMarca con la marca nueva
            SELECT @idMarcaParaCambiar = M.idMarca
            FROM Marca as M
            WHERE M.nombre = @nombreMarca
        END
    ELSE
        BEGIN --Se agrega la marca a la tabla y se toma el id creado recien
            INSERT INTO Marca (nombre) VALUES (@nombreMarca)
            SET @idMarcaParaCambiar = SCOPE_IDENTITY ()
            SET @idMarca = @idMarcaParaCambiar
        END

    --Ahora si, se hace el update
    UPDATE Repuesto SET
        nombre = @nombreRepuesto,
        idMarca = @idMarcaParaCambiar,
        modelo = @modelo,
        cantidad = @cantidad,
        año = @año

    WHERE nombre = @nombreRepuestoPasado
        AND modelo = @modeloPasado AND cantidad = @cantidadPasado AND año = @añoPasado
END
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.ModificarRepuesto 'Volante Limited', 'Volante', 'Mercedez', 'Ferrari', 1500, 1234, 2020, 2001, 0, 6
GO

