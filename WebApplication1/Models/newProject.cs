using System.ComponentModel.DataAnnotations;
namespace WebApplication1.Models;


public class newProject
{   
    public int Id {get; set; }
    [Required, MaxLength(100)]
    public string nameProject {get; set;} = "";
    public string status {get; set; } = "private"; // nếu không lưu giá trị khác thì sẽ lưu private
    
    // Ngày giờ tạo dự án
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // tạo mối quan hệ hai bảng user và newProject
    public int UserId {get;set;} // lưu giá trị khóa ngoại user

    //navigation property (thuộc tính điều hướng), cho phép bạn truy cập đối tượng User liên quan đến Project.
    public User? User {get;set;} // null! tắt phát sinh cảnh báo CS8618 //Dấu ? có nghĩa là thuộc tính User có thể chưa có giá trị (null) khi tạo dự án mới.

    // public ICollection<taskItem> TaskItems {get; set;} = new List<taskItem>();

    // Một dự án có nhiều trạng thái khác nhau
    public ICollection<AddStatusTask> StatusTasks {get;set;} = new List<AddStatusTask>();

}