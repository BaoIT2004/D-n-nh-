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
        
        //Thêm dự án
        public async Task<ApiResponse<ProjectResponseDto>> AddNewProject(ProjectRequestDto project)
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
                return new ApiResponse<ProjectResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Thêm dữ liệu không hợp lệ",
                    Data = null!,
                    Errors = errors
                };
            }

            var user = _dbContext.Users.Any(user => user.Id == project.UserId);
            if (!user)
            {
                return new ApiResponse<ProjectResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "KHông tìm thấy người dùng",
                    Data = null!,
                    Errors = errors
                };
            }

            //2.Tại dữ liệu
            var newProject = new NewProject
            {
                NameProject = project.NameProject,
                Status = project.Status,
                UserId = project.UserId
            };
            //3. Lưu dữ liệu
            await _projectRepository.AddProjectAsync(newProject);

            //4. Map dữ liệu qua controller
            return new ApiResponse<ProjectResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Đăng ký thành công",
                Data = new ProjectResponseDto
                {
                    NameProject = project.NameProject,
                    Status = project.Status
                }
            };
        }
    

        //Hiển thị toàn bộ dự án
        public async Task<ApiResponse<List<GetAllProjectResponseDto>>> GetAllProject()
        {
            //1.Lấy toàn bộ thông tin dự án
            var project = await _projectRepository.GetAllProjectAsync();

            //2.Map sang GetAllUsersAsync trả về cho Controller

            return new ApiResponse<List<GetAllProjectResponseDto>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Hiển thị thông tin của dự án",
                Data = project.Select(project => new GetAllProjectResponseDto
                {
                    NameProject = project.NameProject,
                    Status = project.Status,
                    UserId = project.UserId
                }).ToList()
            };
        }

        //cập nhật dự án

        public async Task<ApiResponse<UpdateProjectReSponseDto>> UpdateProjectAsync(UpdateProjectRequestDto project, int id)
        {
            //1. Validate dự liệu
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(project.NameProject))
            {
                errors.Add("không để trống tên dự án");
            }

            if (string.IsNullOrWhiteSpace(project.Status))
            {
                errors.Add("Không để trống trạng thái dự án");
            }

            if(errors.Count > 0)
            {
                return new ApiResponse<UpdateProjectReSponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = null!,
                    Errors = errors
                };
            }

            //2. Tìm id của dự án  FirstOrDefault: tìm phần tử đầu tiên
            var update = _dbContext.Projects.FirstOrDefault(p=> p.Id == id);  // tìm đầu tiên trong bảng project có Id bằng với biến id 

            if(update == null)
            {
                return new ApiResponse<UpdateProjectReSponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Không tìm thấy id",
                    Data = null!,
                    Errors = errors
                };
            }
            else
            {
                update.NameProject = project.NameProject;
                update.Status = project.Status;

            };
            //3. Lưu thông tin sau cập nhật
            await _projectRepository.UpdateProjectAsync(update);

            //4. Map qua controlle

            return new ApiResponse<UpdateProjectReSponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Cập nhật thành công",
                Data = new UpdateProjectReSponseDto
                {
                    NameProject = update.NameProject,
                    Status = update.Status
                }
            };
        }
    
    
    }
}