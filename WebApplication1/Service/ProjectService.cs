using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;
using WebApplication1.Repositories;
using WebApplication1.DTOs.Auth;
using WebApplication1.DTOs.Project;

namespace WebApplication1.Services
{
    public class ProjectService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ProjectRepository _projectRepository;

        public ProjectService(
            ApplicationContext dbContext,
            ProjectRepository projectRepository)
        {
            _dbContext = dbContext;
            _projectRepository = projectRepository;
        }

        public async Task<ApiResponse<ProjectResponseDTo>> AddNewProject(NewProject project)
        {
            //1. Validate nôi dung người dùng gửi
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(project.NameProject))
            {
                errors.Add("không để trống tên dự án");
            }
            if (string.IsNullOrWhiteSpace(project.Status))
            {
                errors.Add("Bạn phải chọn trạng thái");
            }
            if (errors.Count > 0)
            {
                return new ApiResponse<ProjectResponseDTo>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Thêm dữ liệu không hợp lệ",
                    Data = null!,
                    Errors = errors
                };
            }

            //2.Tại dữ liệu
            var newProject = new NewProject
            {
                NameProject = project.NameProject,
                Status = project.Status
            };
            //3. Lưu dữ liệu
            await _projectRepository.AddProjectAsync(newProject);

            //4. Map dữ liệu qua controller
            return new ApiResponse<ProjectResponseDTo>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Đăng ký thành công",
                Data = new ProjectResponseDTo
                {
                    NameProject = project.NameProject,
                    Status = project.Status
                }
            };
        }
    }
}