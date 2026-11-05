using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs.TaskItem;
using WebApplication1.Service;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemController : Controller
    {
        private readonly TaskItemService _taskItemService;

        public TaskItemController(TaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
        }

        //Thêm
        [HttpPost("{statusId}")]
        [Authorize]
        public async Task<IActionResult> AddTaskItem([FromBody] AddTaskItemRequestDto request, int statusId)
        {
            var user = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _taskItemService.AddTaskItem(request, user, statusId);
            return StatusCode(result.StatusCode, result);
        }

        //Hiển thị
        [HttpGet("{statusId}")]
        [Authorize]
        public async Task<IActionResult> GetAllTaskItem(int statusId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.GetAllTaskItem(statusId, userId);
            return StatusCode(response.StatusCode, response);
        }

        //chỉnh sửa
        [HttpPut("{taskItemId}")]
        [Authorize]
        public async Task<IActionResult> UpdateTaskItem(int taskItemId, [FromBody] UpdateTaskItemRequestDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.UpdateTaskItemService(request, userId, taskItemId);
            return StatusCode(response.StatusCode, response);
        }

        //xóa
        [HttpDelete("{taskItemId}")]
        [Authorize]
        public async Task<IActionResult> DeleteTaskItem(int taskItemId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _taskItemService.DeleteTaskItem(userId, taskItemId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
