
using System.ComponentModel.DataAnnotations;
namespace WebApplication1.Models;

public class RefreshRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
