public class TaskAttachmentResponseDto
{
    public int Id { get; set; }
    public required string FileName { get; set; }
    public DateTimeOffset UploadedAt { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public int TaskItemId { get; set; }
}
