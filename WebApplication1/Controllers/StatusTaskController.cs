
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusTaskController : Controller
    {
        private readonly ApplicationContext dbContext;
        private readonly StatusTaskService _statustTaskervice;
        public StatusTaskController(
            ApplicationContext dbContext,
            StatusTaskService statusTaskService)
        {
            this.dbContext = dbContext;
            _statustTaskervice = statusTaskService;
        }


        //Thêm trạng thái
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddStatusTask([FromBody] StatusTaskRequestDto request)
        {
            var response = await _statustTaskervice.AddNewStatusTaskAsync(request);
            return StatusCode(response.StatusCode, response);
        }
        

        //Hiển thị 
        [HttpGet("{projectId}")]
        [Authorize]
        public async Task<IActionResult> AllStatusTasks(int projectId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _statustTaskervice.GetAllStatusTasksAsync(projectId, userId);
            return StatusCode(response.StatusCode, response);
        }


        //Xóa
        [HttpDelete("delete/{projectId}/{statusTaskId}")]
        [Authorize]
        public async Task<IActionResult> DeleteStatusTask(int projectId, int statusTaskId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _statustTaskervice.DeleteStatusTaskAsync(projectId, userId, statusTaskId);
            return StatusCode(response.StatusCode, response);
        }

    }


}