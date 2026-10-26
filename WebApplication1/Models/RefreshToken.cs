
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace WebApplication1.Models;

public class refreshToken
{
    public int Id { get; set; }

    public string Tokens { get; set; } = string.Empty;

    public DateTime Expiry { get; set; }

    public string? RefreshToken {get;set;}

    public int UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User? userId { get; set; }
}