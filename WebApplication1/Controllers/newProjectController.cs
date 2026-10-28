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



        // tạo dự án "R"
        [HttpPost]
        [Authorize] // jwt hợp lệ mới tạo được project 
        public async Task<IActionResult> AddProject([FromBody] ProjectRequestDto project)
        {
           
            var response = await _projectService.AddNewProject(project);    
             return StatusCode(response.StatusCode, response);
        }


        //2.Hiển thị dự án
        [HttpGet("AllProject")]
        [Authorize]
        public async Task<IActionResult> AllProject()
        {
            var response = await _projectService.GetAllProject();
            return StatusCode(response.StatusCode, response);
        }

        //3.Cập nhật dự án
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject([FromBody] UpdateProjectRequestDto project, int id)
        {
            var response = await _projectService.UpdateProjectAsync(project,id);
            return StatusCode(response.StatusCode, response);
        }

        // // cập nhật thông tin dự án "U"
        // [HttpPut("{id}")]
        // [Authorize]
        // public async Task<IActionResult> UpdateProject(newProject newProject, int id)
        // {
        //     var update = dbContext.Projects.FirstOrDefault(p => p.Id == id); // lấy từ bảng project ./ 
        //     // ấy bản ghi đầu tiên thỏa điều kiện. Nếu không có bản ghi nào thì trả về null thay vì báo lỗi./
        //     //p => p.Id == id là điều kiện lọc (lambda)  p đại diện cho từng dự án trong bảng, và dòng này nghĩa là “lấy dự án nào có Id bằng id được truyền vào”.s
        //     if (update == null)
        //     {
        //         return NotFound(new { message = "Không tìm thấy dự án." });
        //     }
        //     update.nameProject = newProject.nameProject;
        //     update.status = newProject.status;  

        //     dbContext.SaveChanges();
        //     return Ok(new {
        //         message = "Cập nhật thành công"
        //     });
        // }

                
    }

}