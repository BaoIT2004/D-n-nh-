
using System.ComponentModel.DataAnnotations;
namespace WebApplication1.Models;

public class RefreshRequestModel
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}