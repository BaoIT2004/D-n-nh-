namespace WebApplication1.Models;

public class User
{
    public int Id { get; set; }
    // [Required(ErrorMessage = "Không để trống tên")]
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string passWord { get; set; } = "";

    public ICollection<newProject> Projects {get; set;} = new List<newProject>();
}