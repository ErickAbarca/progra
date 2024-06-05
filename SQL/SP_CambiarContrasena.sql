CREATE PROCEDURE CambiarContrasena
    @usuario VARCHAR(64),
    @nuevaContrasena VARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @mensaje NVARCHAR(4000);
    UPDATE Usuario SET password = @nuevaContrasena WHERE username = @usuario;
END