
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class StatusTaskService
    {
        private readonly ApplicationContext _dbContext;
        private readonly StatusTaskRepository _statusTaskRepository;

        public StatusTaskService(
           ApplicationContext dbcontext,
           StatusTaskRepository statusTaskRepository
        )
        {
            _dbContext = dbcontext;
            _statusTaskRepository = statusTaskRepository;
        }

        public async Task<ApiResponse<StatusTaskResponseDto>> AddNewStatusTask ([FromBody] StatusTaskRequestDto request)
        {
            var errors = new List<string>();

            if(errors.Count >0)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                  StatusCode = StatusCodes.Status400BadRequest,
                  Status = false,
                  Message = "Lỗi ",
                  Data = null!,
                  Errors = errors
                };
            }

            var statusTask = await _dbContext.Users.AnyAsync(p => p.Id == request.ProjectId);

            if (!statusTask)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                  StatusCode = StatusCodes.Status400BadRequest,
                  Status = false,
                  Message = "không tìm thấy dự án",
                  Errors = errors  
                };
            }

            //Thêm trạng thái
            var newStatusTask = new AddStatusTask
            {
                StatusTask = request.StatusTask,
                ProjectId = request.ProjectId
            };
            
            //lưu vào db
            await _statusTaskRepository.AddStatusTaskAsync(newStatusTask);


            //Map qua controller
            return new ApiResponse<StatusTaskResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Thêm trạng thái thành công",
                Data = new StatusTaskResponseDto
                {
                    StatusTask = request.StatusTask,
                    ProjectId = request.ProjectId
                },
                Errors = errors
            };

        }
    }
}