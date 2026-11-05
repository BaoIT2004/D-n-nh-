namespace WebApplication1.DTOs.TaskItem;

public class UpdateTaskItemResponseDto
{
    public required string Title { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
