namespace WebApplication1.DTOs.TaskItem;

public class UpdateAssigneeResponseDto
{
    public int TaskItemId { get; set; }
    public int? AssigneeId { get; set; }
    public string? AssigneeEmail { get; set; }
}