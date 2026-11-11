namespace WebApplication1.Models;

public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string WorkType { get; set; } = "";

    public string Degree { get; set; } = "";

    // dự án chứa công việc này
    public int StatusId { get; set; }
    public AddStatusTask? Status { get; set; }
    public List<TaskAttachment> Attachments { get; set; } = new();

    public int? CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }

    public int? ParentId { get; set; } //Cột trong DB, lưu Id của task cha. null = task gốc.
    public TaskItem? Parent { get; set; } //navigation property, từ một subtask truy cập thẳng task cha (subtask.Parent.Title) mà không cần tự query theo ParentId.// phía "một": con -> cha
    public List<TaskItem> SubTasks { get; set; } = new List<TaskItem>();// phía "nhiều": cha -> các con từ một task cha, đi xuống lấy nhiều task con. Vì “nhiều” nên phải là một tập hợp (List<TaskItem>), không thể là một TaskItem đơn.
    public int? AssigneeId { get; set; } //khóa ngoại trỏ tới bảng User, cho biết ai được giao task này. null nghĩa là chưa giao cho ai.
    public User? Assignee { get; set; } //lấy ra đối tượng User được giao
}
