-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.ConsultarRepuesto
    @nombreRepuesto VARCHAR (50),
    @nombreMarca VARCHAR (42),
    @modelo INT,
    @año INT
AS
BEGIN

    SELECT 
        R.nombre AS [Nombre del repuesto],
        M.nombre AS [Nombre de la marca],
        R.modelo AS [Modelo del repuesto],
        R.año AS [Año del repuesto],
        R.cantidad AS [Cantidad Actual]
    FROM Repuesto AS R
        INNER JOIN Marca AS M ON R.idMarca = M.idMarca
    WHERE 
        @nombreRepuesto = R.nombre AND 
        @nombreMarca = M.nombre AND
        @año = R.año AND
        @modelo = R.modelo

END
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.ConsultarRepuesto 'Freno Limited', 'Toyota', 18, 2014
GO