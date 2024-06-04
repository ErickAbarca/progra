CREATE PROCEDURE ModificarVehiculo
    @nombreMarca VARCHAR(42),
    @modelo VARCHAR(64),
    @estilo VARCHAR(42),
    @año VARCHAR(10), -- Usar VARCHAR para validación inicial
    @transmision VARCHAR(42),
    @estado INT,
    @color VARCHAR(16),
    @combustible VARCHAR(42),
    @cilindrada VARCHAR(10), -- Usar VARCHAR para validación inicial
    @numeroPasajeros VARCHAR(10), -- Usar VARCHAR para validación inicial
    @numeroPuertas VARCHAR(10), -- Usar VARCHAR para validación inicial
    @placaNoCambia VARCHAR(16)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @mensaje NVARCHAR(4000);

    BEGIN TRY
        -- Verificar que los parámetros pueden ser convertidos a INT
        IF TRY_CAST(@año AS INT) IS NULL
        BEGIN
            SET @mensaje = 'El año proporcionado no es un número válido';
            RAISERROR (@mensaje, 16, 1);
            RETURN;
        END

        IF TRY_CAST(@cilindrada AS INT) IS NULL
        BEGIN
            SET @mensaje = 'La cilindrada proporcionada no es un número válido';
            RAISERROR (@mensaje, 16, 1);
            RETURN;
        END

        IF TRY_CAST(@numeroPasajeros AS INT) IS NULL
        BEGIN
            SET @mensaje = 'El número de pasajeros proporcionado no es un número válido';
            RAISERROR (@mensaje, 16, 1);
            RETURN;
        END

        IF TRY_CAST(@numeroPuertas AS INT) IS NULL
        BEGIN
            SET @mensaje = 'El número de puertas proporcionado no es un número válido';
            RAISERROR (@mensaje, 16, 1);
            RETURN;
        END

        -- Convertir los parámetros a INT después de la validación
        DECLARE @añoInt INT = CAST(@año AS INT);
        DECLARE @cilindradaInt INT = CAST(@cilindrada AS INT);
        DECLARE @numeroPasajerosInt INT = CAST(@numeroPasajeros AS INT);
        DECLARE @numeroPuertasInt INT = CAST(@numeroPuertas AS INT);

        BEGIN TRANSACTION;

        DECLARE @idMarcaBuscar INT, @idEstiloBuscar INT, @idTransmisionBuscar INT, @idCombustibleBuscar INT;

        -- Obtener todos los IDs necesarios
        SELECT @idMarcaBuscar = idMarca FROM Marca WHERE nombre = @nombreMarca;
        SELECT @idEstiloBuscar = idEstilo FROM Estilo WHERE nombre = @estilo;
        SELECT @idTransmisionBuscar = idTransmision FROM Transmision WHERE nombre = @transmision;
        SELECT @idCombustibleBuscar = idCombustible FROM Combustible WHERE nombre = @combustible;

        -- Verificar que todos los IDs fueron encontrados
        IF @idMarcaBuscar IS NULL
        BEGIN
            SET @mensaje = 'Marca no encontrada';
            RAISERROR (@mensaje, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @idEstiloBuscar IS NULL
        BEGIN
            SET @mensaje = 'Estilo no encontrado';
            RAISERROR (@mensaje, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @idTransmisionBuscar IS NULL
        BEGIN
            SET @mensaje = 'Transmision no encontrada';
            RAISERROR (@mensaje, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @idCombustibleBuscar IS NULL
        BEGIN
            SET @mensaje = 'Combustible no encontrado';
            RAISERROR (@mensaje, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Realizar el update
        UPDATE Vehiculo
        SET
            idMarca = @idMarcaBuscar,
            idEstilo = @idEstiloBuscar,
            año = @añoInt,
            idTransmision = @idTransmisionBuscar,
            estado = @estado,
            color = @color,
            idCombustible = @idCombustibleBuscar,
            cilindrada = @cilindradaInt,
            numeroPasajeros = @numeroPasajerosInt,
            numeroPuertas = @numeroPuertasInt,
            modelo = @modelo
        WHERE placa = @placaNoCambia;

        -- Verificar si el update afectó filas
        IF @@ROWCOUNT = 0
        BEGIN
            SET @mensaje = 'No se encontraron filas para actualizar con la placa proporcionada';
            RAISERROR (@mensaje, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Confirmar la transacción
        COMMIT TRANSACTION;
        SET @mensaje = 'Transacción confirmada';
        RAISERROR (@mensaje, 10, 1) WITH NOWAIT;
    END TRY
    BEGIN CATCH
        -- Manejo de errores
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
            PRINT 'Transacción revertida';
        END
        
        DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();
        
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO