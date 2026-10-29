using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;
using WebApplication1.Repositories;
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
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "KHông tìm thấy người dùng",
                    Data = null!,
                    Errors = errors
                };
            }

            //2.Tại dữ liệu
            var newProject = new newProject
            {
                nameProject = project.NameProject,
                status = project.Status,
                UserId = project.UserId
            };
            //3. Lưu dữ liệu
            await _projectRepository.AddProjectAsync(newProject);

            //4. Map dữ liệu qua controller
            return new ApiResponse<ProjectResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Tạo dự án thành công",
                Data = new ProjectResponseDto
                {
                    NameProject = project.NameProject,
                    Status = project.Status
                }
            };
        }

        //Hiển thị toàn bộ dự án
        public async Task<ApiResponse<List<GetAllProjectResponseDto>>> GetAllProjects(int userId)
        {
            //1.Lấy toàn bộ thông tin dự án
            var projects = await _projectRepository.GetAllProjectAsync(userId);

            //2.Map sang GetAllUsersAsync trả về cho Controller

            return new ApiResponse<List<GetAllProjectResponseDto>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Hiển thị thông tin của dự án",
                Data = projects.Select(project => new GetAllProjectResponseDto
                {
                    Id = project.Id,
                    NameProject = project.nameProject,
                    Status = project.status,
                    CreatedAt = project.CreatedAt,
                    UserId = project.UserId
                }).ToList()
            };
        }

        //cập nhật dự án
        public async Task<ApiResponse<ProjectResponseDto>> UpdateProjectAsync(UpdateProjectRequestDto project, int id)
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

            if (errors.Count > 0)
            {
                return new ApiResponse<ProjectResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = null!,
                    Errors = errors
                };
            }

            //2. Tìm id của dự án  FirstOrDefault: tìm phần tử đầu tiên
            var update = _dbContext.Projects.FirstOrDefault(p => p.Id == id);  // tìm đầu tiên trong bảng project có Id bằng với biến id 

            if (update == null)
            {
                return new ApiResponse<ProjectResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy id",
                    Data = null!,
                    Errors = errors
                };
            }
            else
            {
                update.nameProject = project.NameProject;
                update.status = project.Status;

            }
            ;
            //3. Lưu thông tin sau cập nhật
            await _projectRepository.UpdateProjectAsync(update);

            //4. Map qua controlle

            return new ApiResponse<ProjectResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Cập nhật thành công",
                Data = new ProjectResponseDto
                {
                    NameProject = update.nameProject,
                    Status = update.status
                }
            };
        }

        //Xóa dự án 
        public async Task<ApiResponse<DeleteProjectResponseDto>> DeleteProjectAsync(int id)
        {
            var errors = new List<string>();
            //1.Tìm dự án cần xóa
            var deleteProject = await _projectRepository.GetProjectByIdAsunc(id);

            //2.Kiểm tra project có tồn tại không

            if (deleteProject == null)
            {
                return new ApiResponse<DeleteProjectResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy project",
                    Data = null!,
                    Errors = errors
                };
            }

            //3.Xóa dự án
            await _projectRepository.DeleteProjectAsync(deleteProject);
            //4.Nap quan cotroller
            return new ApiResponse<DeleteProjectResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Xóa dự án thành công",
                Data = new DeleteProjectResponseDto
                {
                    // Id = deleteProject.Id,
                    Message = "Xóa dự án thành công"
                }
            };

        }

    }
}