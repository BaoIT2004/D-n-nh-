using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using  WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewProjectController : Controller
    {
        private readonly ApplicationContext dbContext;
        private readonly ProjectService _projectService;

        public NewProjectController(
            ApplicationContext dbContext,
            ProjectService projectService)
        {
            this.dbContext = dbContext;
            _projectService = projectService;
        }

        // tạo dự án
        [HttpPost]
        [Authorize] // jwt hợp lệ mới tạo được project
        public async Task<IActionResult> AddProject([FromBody] ProjectRequestDto project)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectService.AddNewProject(project, userId);
            return StatusCode(response.StatusCode, response);
        }


        //Hiển thị dự án
        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> AllProject(int userId)
        {
            var userMember = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectService.GetAllProjects(userId , userMember);
            return StatusCode(response.StatusCode, response);
        }

        //Cập nhật dự án
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject([FromBody] UpdateProjectRequestDto project, int id)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var response = await _projectService.UpdateProjectAsync(project, id, userId);
            return StatusCode(response.StatusCode, response);
        }

        // Xóa dự án
        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectService.DeleteProjectAsync(id, userId);
            return StatusCode(response.StatusCode, response);
        }
    }

}