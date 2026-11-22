namespace WebApplication1.DTOs.TaskItem
{
    public class ReorderTaskItemResponseDto
    {
        public List<int> Ids { get; set; } = new();
        public int StatusId { get; set; }
    }
}
