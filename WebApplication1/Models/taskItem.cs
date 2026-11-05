namespace WebApplication1.Models;

public class TaskItem
    {
        public int Id {get; set;}
        public required string Title {get;set;}
        public  DateOnly CreatedAt  {get;set;}
        public  string WorkType {get;set;} ="";

        public string Degree {get;set;} = "";

        // dự án chứa công việc này
        public int StatusId { get; set; }
        public AddStatusTask? Status { get; set; } 
}