namespace WebApplication1.DTOs.TaskItem;

public class UpdateTaskItemRequestDto
{
    public required string Title { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
