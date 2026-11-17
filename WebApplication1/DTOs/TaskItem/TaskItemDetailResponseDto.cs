namespace WebApplication1.DTOs.TaskItem;

public class TaskItemDetailResponseDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public DateOnly CreatedAt { get; set; }
    public DateOnly? DueDate { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public int ProjectId { get; set; }
    public string CreatedByEmail { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public List<SubTaskResponseDto> SubTasks { get; set; } = new();

    public int? AssigneeId { get; set; }
    public string? AssigneeEmail { get; set; }
}
