using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class ProjectMemberService
    {
        private readonly ProjectRepository _projectRepository;
        private readonly ProjectMemberRepository _projectMemberRepository;

        public ProjectMemberService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository)
        {
            _projectRepository = projectRepository;
            _projectMemberRepository = projectMemberRepository;
        }


        public async Task<ApiResponse<ProjectMembersResponseDto>> AddMemberAsync(int projectId, int userId, ProjectMembersRequestDto request)
        {
            var project = await _projectRepository.GetProjectByIdAsync(projectId);
            if (project == null)
            {
                return new ApiResponse<ProjectMembersResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var isOwner = project.UserId == userId;
            if (!isOwner)
            {
                return new ApiResponse<ProjectMembersResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Chỉ chủ dự án mới được mời thành viên",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var user = await _projectMemberRepository.GetUserByEmailAsync(request.Email);

            if (user == null)
            {
                return new ApiResponse<ProjectMembersResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "không tìm thấy người dùng",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var memberUser = await _projectMemberRepository.IsMemberAsync(projectId, user.Id);

            if (memberUser)
            {
                return new ApiResponse<ProjectMembersResponseDto>
                {
                    StatusCode = StatusCodes.Status409Conflict,
                    Status = false,
                    Message = "Người này đã có trong dự án",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var members = new ProjectMember
            {
                ProjectId = projectId,
                UserId = user.Id
            };

            await _projectMemberRepository.AddMemberAsync(members);

            return new ApiResponse<ProjectMembersResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Đã thêm thành viên",
                Data = new ProjectMembersResponseDto
                {
                    Id = members.Id,
                    ProjectId = members.ProjectId,
                    UserId = members.UserId,
                    UserName = user.Name
                },
                Errors = new List<string>()
            };
        }
    }
}
