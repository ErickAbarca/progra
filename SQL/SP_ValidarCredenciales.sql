ALTER PROCEDURE ValidarCredenciales
    @username VARCHAR(64),
    @password VARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Usuario WHERE username = @username AND password = @password)
    BEGIN
        SELECT 'Usuario válido' AS [Estado];
    END
    ELSE
    BEGIN
        SELECT 'Usuario inválido' AS [Estado];
    END
END
GO