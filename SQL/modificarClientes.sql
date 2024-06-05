CREATE procedure modificarClientes
    @nombre varchar(50),
    @email varchar(50),
    @direccion varchar(50),
    @id int
AS
BEGIN
    UPDATE Cliente
    SET nombre = @nombre, email = @email, direccion = @direccion
    WHERE idCliente = @id
END
GO
