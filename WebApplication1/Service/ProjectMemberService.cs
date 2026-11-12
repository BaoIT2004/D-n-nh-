using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.Member;
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

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return new ApiResponse<ProjectMembersResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Email không được để trống",
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



        public async Task<ApiResponse<List<GetMemberResponseDTo>>> GetMemberAsync(int projectId, int userId)
        {
            var project = await _projectRepository.GetProjectByIdAsync(projectId);
            if (project == null)
            {
                return new ApiResponse<List<GetMemberResponseDTo>>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Errors = new List<string>()
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(projectId, userId);
            if (!canAccess)
            {
                 return new ApiResponse<List<GetMemberResponseDTo>>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án này",
                    Errors = new List<string>()
                };
            }

            var users = await _projectMemberRepository.GetProjectUsersAsync(projectId);
            if (!users.Any(u => u.Id == userId)) // any dùng để kiểm tra xem trong danh sách có ít nhất một phần tử thỏa mãn điều kiện hay không.
            {
                return new ApiResponse<List<GetMemberResponseDTo>>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Bạn không thuộc dự án này",
                    Errors = new List<string>()
                };
            }

            return new ApiResponse<List<GetMemberResponseDTo>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Hiển thị đanh sách thành công",
                //Select(u => ...): duyệt từng User (đặt tên là u) và biến đổi nó thành một đối tượng khác
                //new GetMemberResponseDTo { Id = u.Id, Email = u.Email }: tạo DTO mới, chỉ copy Id và Email.
                Data = users.Select(u => new GetMemberResponseDTo
                {
                    Id = u.Id,
                    Email = u.Email,
                }).ToList()
            };
        }

    }
}
