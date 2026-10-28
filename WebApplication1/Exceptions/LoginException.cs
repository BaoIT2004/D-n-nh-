namespace WebApplication1.Exceptions;

public sealed class LoginException : Exception
{
    public LoginException(string message) : base(message)
    {
    }
}
