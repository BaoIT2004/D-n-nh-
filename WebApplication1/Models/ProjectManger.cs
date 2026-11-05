namespace WebApplication1.Models;

public class ProjectMember
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public newProject Project { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
