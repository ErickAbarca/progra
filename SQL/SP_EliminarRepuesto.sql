-- Create the stored procedure in the specified schema
ALTER PROCEDURE dbo.EliminarRepuesto
    @codigoRepuesto INT

AS
BEGIN
    DELETE R FROM Repuesto AS R
    WHERE 
        R.idRepuesto = @codigoRepuesto
END
GO
