-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.ModificarRepuesto

    @idRepuesto INT,

    @nombreRepuesto VARCHAR (50),
    @nombreMarca VARCHAR (42),
    @modelo VARCHAR (50),
    @año INT,
    @cantidad INT

AS
BEGIN

    -- Se busca si la marca nueva a cambiar ya esta en la tabla
    DECLARE @idMarca INT

    SELECT @idMarca = M.idMarca
    FROM Marca AS M
    WHERE M.nombre = @nombreMarca


    --Ahora si, se hace el update
    UPDATE Repuesto SET
        nombre = @nombreRepuesto,
        idMarca = @idMarca,
        modelo = @modelo,
        cantidad = @cantidad,
        año = @año

    WHERE idRepuesto = @idRepuesto
END
GO

