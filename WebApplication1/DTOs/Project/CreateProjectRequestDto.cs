namespace WebApplication1.DTOs.Project;

public class ProjectRequestDto
{
    public string NameProject { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int UserId { get; set; }
}
