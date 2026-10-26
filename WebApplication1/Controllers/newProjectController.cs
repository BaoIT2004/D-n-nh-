using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;


namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class newProjectController : Controller
    {
        private readonly ApplicationContext dbContext;
        private object message;

        public newProjectController(ApplicationContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Heieenrn thị dự án "R"
        [HttpPost]
        [Authorize] // jwt hợp lệ mới tạo được project 
        public IActionResult AddProject(newProject project)
        {
            var newProject = dbContext.Users.Any(user => user.Id == project.UserId);
            if (!newProject)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy người dùng."
                });
            }

            var allowedStatuses = new[]
            {
                "private",
                "workspace",
                "public"
            };

            if (!allowedStatuses.Contains(project.status))
            {
                return BadRequest(new
                {
                    message = "Trạng thái dự án không hợp lệ."
                });
            }

            var addNewProject = new newProject
            {
                nameProject = project.nameProject,
                status = project.status,
                UserId = project.UserId
            };

            dbContext.Projects.Add(addNewProject);
            dbContext.SaveChanges();
            return Ok(new
            {
                message = "Tạo dự án thành công"
            });
        }

        [HttpGet("AllProject")]
        [Authorize]
        public IActionResult GetAllProject(){
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var allProject = dbContext.Projects.Where(p=>p.UserId == userId).ToList();
            return Ok(allProject);
        }

        // cập nhật thông tin dự án "U"
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject(newProject newProject, int id)
        {
            var update = dbContext.Projects.FirstOrDefault(p => p.Id == id); // lấy từ bảng project ./ 
            // ấy bản ghi đầu tiên thỏa điều kiện. Nếu không có bản ghi nào thì trả về null thay vì báo lỗi./
            //p => p.Id == id là điều kiện lọc (lambda)  p đại diện cho từng dự án trong bảng, và dòng này nghĩa là “lấy dự án nào có Id bằng id được truyền vào”.s
            if (update == null)
            {
                return NotFound(new { message = "Không tìm thấy dự án." });
            }
            update.nameProject = newProject.nameProject;
            update.status = newProject.status;  

            dbContext.SaveChanges();
            return Ok(new {
                message = "Cập nhật thành công"
            });
        }

                
    }


}