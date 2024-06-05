ALTER PROCEDURE SP_ObtenerRepuestos
AS
BEGIN
    SET NOCOUNT ON
    SELECT 
        R.idRepuesto,
        R.nombre,
        M.nombre,
        R.modelo,
        R.cantidad,
        R.año


    FROM Repuesto AS R
        INNER JOIN Marca AS M ON R.idMarca = M.idMarca
        
    SET NOCOUNT OFF
END
GO