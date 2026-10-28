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
        public async Task<IActionResult> AddProject(NewProject project)
        {
            var response = await _projectService.AddNewProject(project);
             return StatusCode(response.StatusCode, response);
        }

        // [HttpGet("AllProject")]
        // [Authorize]
        // public IActionResult GetAllProject(){
        //     var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        //     var allProject = dbContext.Projects.Where(p=>p.UserId == userId).ToList();
        //     return Ok(allProject);
        // }

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