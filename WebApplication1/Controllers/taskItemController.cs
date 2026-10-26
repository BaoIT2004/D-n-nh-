using System.Reflection.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class taskItemController : Controller
    {
        private readonly ApplicationContext dbContext;

        public taskItemController(ApplicationContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //Tạo dự án
        [HttpPost("addTask")]
        public IActionResult CreatedAt(taskItem taskItem)
        {
            var task = new taskItem
            {
                Title = taskItem.Title,
                DateTime = taskItem.DateTime,
                WorkType = taskItem.WorkType,
                Degree = taskItem.Degree,
                ProjectId = taskItem.ProjectId
            };

            var projectID = dbContext.Projects.Any(x => x.Id == taskItem.ProjectId);

            if (!projectID)
            {
                var errorResponse = new ApiResponse<object>
                {
                    StatusCode = 400,
                    Status = false,
                    Message = "Lỗi không tìm thấy dự án"
                };
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }

            dbContext.TaskItem.Add(task);
            dbContext.SaveChanges();

            var successResponse = new ApiResponse<object>
            {
                StatusCode = 201,
                Status = true,
                Message = "Tạo task thành công"
            };

            return StatusCode(successResponse.StatusCode, successResponse);

        }


        //Hiển thị dự án
        [HttpGet]
        public IActionResult GetAllTask()
        {
            var task = dbContext.TaskItem.ToList();
            return Ok(task);
        }

        //cập nhật dự án
        [HttpPost("{id}")]
        public ActionResult Update(taskItem taskItem, int id)
        {
            var data = dbContext.TaskItem.FirstOrDefault(p => p.Id == id);

            if (data == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy dự án."
                }
                );
            }

            data.Title = taskItem.Title;
            data.DateTime = taskItem.DateTime;
            data.WorkType = taskItem.WorkType;
            data.Degree = taskItem.Degree;

            dbContext.SaveChanges();
            return Ok(new
            {
                message = "cập nhật thành công"
            });
        }

        //Xóa dự án

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var data = dbContext.TaskItem.FirstOrDefault(x => x.Id == id);

            if (data != null)
            {
                dbContext.TaskItem.Remove(data);
                dbContext.SaveChanges();
            }
            else
            {
                return NotFound(new
                {
                    message = "Không tìm thấy task."
                });
            }
            return Ok(new
            {
                message = "Xóa task thành công"
            });
        }
    }
}