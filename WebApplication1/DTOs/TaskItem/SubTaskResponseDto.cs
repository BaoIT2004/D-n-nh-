namespace WebApplication1.DTOs.TaskItem;

public class SubTaskResponseDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public int? AssigneeId { get; set; }
    public string? AssigneeEmail { get; set; }
}
