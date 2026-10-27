
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusTaskController : Controller
    {
        private readonly ApplicationContext dbContext;
        public StatusTaskController(ApplicationContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Authorize]
        public IActionResult AddStatusTask(AddStatusTask AddStatusTask)
        {
            try
            {
                var newStatusTask = dbContext.Projects.Any(x => x.Id == AddStatusTask.ProjectId);

                if (!newStatusTask)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy người dùng."
                    });
                }

                var allowedStatuses = new[] { "Todo", "Inprogress", "Done" };
                if (!allowedStatuses.Contains(AddStatusTask.StatusTask))
                {
                    return BadRequest(new
                    {
                        message = "Trạng thái dự án không hợp lệ."
                    });
                }

                // thêm người

                var addnewStatusTask = new AddStatusTask
                {
                    StatusTask = AddStatusTask.StatusTask,
                    ProjectId = AddStatusTask.ProjectId
                };

                dbContext.addStatusTasks.Add(addnewStatusTask);
                dbContext.SaveChanges();
                return Ok(new
                {
                    message = "Tạo trạng thái thành công"
                });

            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }

        }

        //Lỗi 
        [HttpGet("{projectId}")]
        [Authorize]
        public IActionResult GetStatusTasks(int projectId)
        {
            var list = dbContext.addStatusTasks
                .Where(x => x.ProjectId == projectId)
                .Select(x => new { x.Id, x.StatusTask })
                .ToList();

            return Ok(list);
        }
    }



}