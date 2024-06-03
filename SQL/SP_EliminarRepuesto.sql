-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.EliminarRepuesto
    @nombreRepuesto VARCHAR (50),
    @nombreMarca VARCHAR (42),
    @modelo INT,
    @año INT
AS
BEGIN
    DELETE R FROM Repuesto AS R
    INNER JOIN Marca AS M ON R.idMarca = M.idMarca
    WHERE 
        @nombreRepuesto = R.nombre AND 
        @nombreMarca = M.nombre AND
        @año = R.año AND
        @modelo = R.modelo
END
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.EliminarRepuesto 'Rueda', 'Ferrari', 1234, 2001
GO
