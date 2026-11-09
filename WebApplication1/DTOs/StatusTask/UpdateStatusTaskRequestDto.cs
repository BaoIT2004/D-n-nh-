namespace WebApplication1.DTOs.StatusTask;

public class UpdateStatusTaskRequestDto
{
    public string StatusTask { get; set; } = string.Empty;
    public int ProjectId { get; set; }
}
