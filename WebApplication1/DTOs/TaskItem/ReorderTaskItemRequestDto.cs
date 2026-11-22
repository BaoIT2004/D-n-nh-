namespace WebApplication1.DTOs.TaskItem
{
    public class ReorderTaskItemRequestDto
    {
        public int StatusId { get; set; } 
        public List<int> Ids { get; set; } = new(); // Danh sách Task theo thứ tự mới
    }
}
