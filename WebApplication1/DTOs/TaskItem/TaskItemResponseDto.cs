public class AddTaskItemResponseDto
{
    public int Id { get; set;}
    public required string Title { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
}