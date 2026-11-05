namespace WebApplication1.DTOs.StatusTask;

public class GetAllStatusTaskResponseDto
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ProjectId { get; set; }
}
