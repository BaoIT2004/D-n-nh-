namespace WebApplication1.DTOs.Auth;

public class GetAllUsersResponseDto  
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;

    public string Email {get;set;} = string.Empty;
}