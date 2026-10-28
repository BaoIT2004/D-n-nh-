namespace WebApplication1.Models;

public class taskItem
{
    public int Id {get; set;}
    public required string Title {get;set;}
    public  DateOnly DateTime {get;set;}
    public  string WorkType {get;set;} ="";

    public string Degree {get;set;} = "";

    //tạo khóa ngoại bảng project
    public int ProjectId {get;set;}

    // dự án chứa công việc này
    public NewProject? Project {get; set; }
}