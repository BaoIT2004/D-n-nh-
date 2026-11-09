namespace WebApplication1.DTOs.TaskItem;

public class FileDownloadDtoResponse
{
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public required byte[] FileContent { get; set; }
}
