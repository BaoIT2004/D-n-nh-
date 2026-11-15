using Microsoft.EntityFrameworkCore;
namespace WebApplication1.Models;

[Index(nameof(Email), IsUnique = true)]  // không cho trùng email
public class User : BaseEntity
{
    public int Id { get; set; }
    // [Required(ErrorMessage = "Không để trống tên")]
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string passWord { get; set; } = "";

    public ICollection<newProject> Projects { get; set; } = new List<newProject>();

    public ICollection<ProjectManger> ProjectMembers { get; set; } = new List<ProjectManger>();
}
