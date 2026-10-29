
public class GetAllProjectResponseDto
{
    public int Id { get; set; }
    public string NameProject { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
}