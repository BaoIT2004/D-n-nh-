using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Services;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class TaskAttachmentsController : Controller
    {

        private readonly TaskAttachmentService _taskAttachmentService;

        public TaskAttachmentsController(TaskAttachmentService taskAttachmentService)
        {
            _taskAttachmentService = taskAttachmentService;
        }
        //Thêm
        [HttpPost("{taskItemId}")]
        [Authorize]
        public async Task<IActionResult> AddTaskAttachment([FromForm] IFormFile file, int taskItemId)
        {
            var user = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _taskAttachmentService.UploadAsync(taskItemId, user, file);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{attachmentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteTaskAttachment(int attachmentId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _taskAttachmentService.DeleteAsync(attachmentId, userId);
            return StatusCode(result.StatusCode, result);
        }
    }
}