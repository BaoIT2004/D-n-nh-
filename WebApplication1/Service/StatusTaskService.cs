
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

        private readonly ProjectRepository _projectRepository;

        public StatusTaskService(
           ApplicationContext dbcontext,
           StatusTaskRepository statusTaskRepository,
           ProjectRepository projectRepository
        )
        {
            _dbContext = dbcontext;
            _statusTaskRepository = statusTaskRepository;
            _projectRepository = projectRepository;
        }


        //thêm trạng thái dự án
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
    
        //2.Hiển thị trạng thái dự án
    
        public async Task<ApiResponse<List<GetAllStatusTaskResponseDto>>> GetAllStatusTasks(int projectId)
        {
            var project = await _projectRepository.GetProjectByIdAsunc(projectId);


            if(project == null)
            {
                return new ApiResponse<List<GetAllStatusTaskResponseDto>>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                };
            }

            //1.Lấy toàn bộ  trạng thái dự án 
            var statusTask = await _statusTaskRepository.GetAllStatusProjectAsync(projectId);

            //2.Map qua controller

            return new ApiResponse<List<GetAllStatusTaskResponseDto>>
            {
              StatusCode = StatusCodes.Status200OK,
              Status = true,
              Message ="Hiển thị thành công",
              Data = statusTask.Select(project => new GetAllStatusTaskResponseDto
              {
                  Status = project.StatusTask,
                  ProjectId = project.ProjectId
              }).ToList()
            };

        }



    }
}