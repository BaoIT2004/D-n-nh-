using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class TaskItemController : Controller
    {
        private readonly ApplicationContext _dbContext;
        private readonly TaskItemService _taskItemService;

        public TaskItemController(ApplicationContext dbContext, TaskItemService taskItemService)
        {
            _dbContext = dbContext;
            _taskItemService = taskItemService;
        }
        
        //Thêm 
        [HttpPost("{statusId}")]
        [Authorize]
        public async Task<IActionResult> AddTaskItem([FromBody] AddTaskItemRequestDto request, int statusId)
        {
            var user = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _taskItemService.AddTaskItem(request, user , statusId);
            return StatusCode(result.StatusCode, result);
        }

        //Hiển thị
        [HttpGet("{statusId}")]
        public async Task<IActionResult> GetAllTaskItem(int statusId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.GetAllTaskItem(statusId, userId);
            return StatusCode(response.StatusCode,response);
        }

        //chỉnh sửa
        [HttpPut("{taskItemId}")]
        public async Task<IActionResult> UpdateTaskItem(int taskItemId, [FromBody] UpdateTaskItemkRequestDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.UpdateTaskItemService(request, userId, taskItemId);
            return StatusCode(response.StatusCode, response);
        }

        //xóa
        [HttpDelete("{taskItemId}")]
        public async Task<IActionResult> DeleteTaskItem(int taskItemId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.DeleteTaskItem(userId, taskItemId);
            return StatusCode(response.StatusCode, response);
        }
    }
}