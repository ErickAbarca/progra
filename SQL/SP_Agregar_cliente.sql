CREATE PROCEDURE Agregar_cliente
    @nombre_cliente VARCHAR(50),
    @correo_cliente VARCHAR(50),
    @direccion_cliente VARCHAR(50)
AS
BEGIN
    -- Verificación de existencia del cliente ingresado en la tabla 'Clientes'
    -- Si el cliente no existe, el clienteID será NULL. Si existe tiene el ID del cliente
    DECLARE @clienteID INT
    SELECT @clienteID = idCliente
        FROM Cliente AS C
    WHERE @nombre_cliente = nombre

    -- Inserta el nombre del cliente y obtenemos el id del cliente
    IF @clienteID IS NULL 
    BEGIN
        INSERT INTO Cliente (nombre, email, direccion)
        VALUES (@nombre_cliente, @correo_cliente, @direccion_cliente)

        SET @clienteID = SCOPE_IDENTITY () -- Obtenemos el id del cliente recien insertado
    END
END
GO
