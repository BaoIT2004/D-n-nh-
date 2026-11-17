namespace WebApplication1.Models;

public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? CreatedId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedId { get; set; }
    public bool DelFlag { get; set; } = false;
}
