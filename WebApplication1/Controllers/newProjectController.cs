using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
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
           
            var response = await _projectService.AddNewProject(project);    
             return StatusCode(response.StatusCode, response);
        }


        //Hiển thị dự án
        [HttpGet("AllProject")]
        [Authorize]
        public async Task<IActionResult> AllProject()
        {
            var response = await _projectService.GetAllProject();
            return StatusCode(response.StatusCode, response);
        }

        //Cập nhật dự án
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject([FromBody] UpdateProjectRequestDto project, int id)
        {
            var response = await _projectService.UpdateProjectAsync(project,id);
            return StatusCode(response.StatusCode, response);
        }

        // Xóa dự án
        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var response = await _projectService.DeleteProjectAsync(id);
            return StatusCode(response.StatusCode, response);
        }
        
    }

}