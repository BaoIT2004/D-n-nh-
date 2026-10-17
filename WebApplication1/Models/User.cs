using System.ComponentModel.DataAnnotations;
namespace WebApplication1.Models;

public class User
{
    public int Id { get; set; }
    // [Required(ErrorMessage = "Không để trống tên")]
    public string Name { get; set; } = "";
    [Required(ErrorMessage = "Không để trống Email")]
    public string Email { get; set; } = "";
    [Required(ErrorMessage = "Không để trông mật khẩu")]
    public string passWord { get; set; } = "";
}