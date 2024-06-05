CREATE PROCEDURE eliminarCliente
    @idCliente INT
AS
BEGIN
IF EXISTS (SELECT * FROM Cliente WHERE idCliente = @idCliente)
    BEGIN
        DELETE FROM Cliente WHERE idCliente = @idCliente
    END
ELSE
    BEGIN
        PRINT 'No existe el cliente'
    END
END
GO