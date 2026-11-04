namespace WebApplication1.Models;

public class TaskAttachment
{
    public int Id { get; set; }
    public required string FileName { get; set; }
    public required string StoredFileName { get; set; }
    public string ContentType { get; set; } ="";
    public DateTimeOffset UploadedAt { get; set; }

    public int TaskItemId { get; set; }
    public TaskItem? TaskItem { get; set; }
}