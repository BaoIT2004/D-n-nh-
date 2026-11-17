namespace WebApplication1.DTOs.TaskItem;

public class AddTaskItemRequestDto
{
    public required string Title { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public int? ParentId { get; set; }
    public int? AssigneeId { get; set; }
    public DateOnly CreatedAt { get; set; }
}
