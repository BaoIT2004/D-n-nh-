using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.TaskItem;
using WebApplication1.Models;
using WebApplication1.Repositories;
namespace WebApplication1.Service
{
    public class TaskItemService
    {
        private readonly TaskItemRepositories _taskItemRepositories;
        private readonly StatusTaskRepository _statusTaskRepository;
        private readonly ProjectRepository _projectRepository;
        private readonly ProjectMemberRepository _projectMemberRepository;
        private readonly TaskAttachmentRepository _taskAttachmentRepository;
        private readonly IWebHostEnvironment _environment;
        public TaskItemService(
        TaskItemRepositories taskItemRepositories,
        StatusTaskRepository statusTaskRepository,
        ProjectRepository projectRepository,
        ProjectMemberRepository projectMemberRepository,
        TaskAttachmentRepository taskAttachmentRepository,
        IWebHostEnvironment environment)
        {
            _taskItemRepositories = taskItemRepositories;
            _statusTaskRepository = statusTaskRepository;
            _projectRepository = projectRepository;
            _projectMemberRepository = projectMemberRepository;
            _taskAttachmentRepository = taskAttachmentRepository;
            _environment = environment;
        }
        //thêm
        public async Task<ApiResponse<AddTaskItemResponseDto>> AddTaskItem(AddTaskItemRequestDto request, int userId, int statusTaskId)
        {
            //1. validate dữ liệu
            var err = new List<string>();
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                err.Add("Không để trống tên");
            }
            if (err.Count > 0)
            {
                return new ApiResponse<AddTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Không để trống dữ liệu",
                    Data = null!,
                    Errors = err
                };
            }

            //kiểm tra xem người dùng và trạng thái task có đúng không
            var response = await _statusTaskRepository.GetStatusTaskById(statusTaskId);
            if (response == null)
            {
                return new ApiResponse<AddTaskItemResponseDto>
                {
                    StatusCode = 404,
                    Status = false,
                    Message = "Trạng thái không tồn tại",
                    Data = null!
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(
                response.ProjectId,
                userId
            );
            if (!canAccess)
            {
                return new ApiResponse<AddTaskItemResponseDto>
                {
                    StatusCode = 403,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án",
                    Data = null!
                };
            }

            // kiểm tra task cha có tồn tại không
            if (request.ParentId != null)
            {
                var parent = await _taskItemRepositories.GetTaskItemAsync(request.ParentId.Value);
                if (parent == null)
                {
                    return new ApiResponse<AddTaskItemResponseDto>
                    {
                        StatusCode = 404,
                        Status = false,
                        Message = "Task cha không tồn tại",
                        Data = null!
                    };
                }
                //kiểm tra taslk cha phải cùng 1 project
                if (parent.Status!.ProjectId != response.ProjectId)
                {
                    return new ApiResponse<AddTaskItemResponseDto>
                    {
                        StatusCode = 400,
                        Status = false,
                        Message = "Task cha không thuộc dự án này",
                        Data = null!
                    };
                }
            }
            // tạo mới
            var newTaskItem = new TaskItem
            {
                Title = request.Title,
                CreatedAt = request.CreatedAt,   // DateOnly
                WorkType = request.WorkType,
                Degree = request.Degree,
                StatusId = statusTaskId,
                CreatedByUserId = userId,
                ParentId = request.ParentId,
            };
            await _taskItemRepositories.AddTaskItem(newTaskItem);
            return new ApiResponse<AddTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Thêm thành công",
                Data = new AddTaskItemResponseDto
                {
                    Id = newTaskItem.Id,
                    Title = newTaskItem.Title,
                    CreatedAt = newTaskItem.CreatedAt,
                    Status = response.StatusTask,
                    Degree = newTaskItem.Degree,
                    ParentId = newTaskItem.ParentId
                }
            };
        }

        //Hiển thị
        public async Task<ApiResponse<List<AddTaskItemResponseDto>>> GetAllTaskItem(int statusId, int userId)
        {
            var status = await _statusTaskRepository.GetStatusTaskById(statusId);
            if (status == null || !await _projectRepository.CanAccessProjectAsync(status.ProjectId, userId)) //status.Project?.UserId != userId:Kiểm tra xem Project chứa Status này có thuộc về người dùng đang đăng nhập hay không.
            {
                return new ApiResponse<List<AddTaskItemResponseDto>>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Trạng thái không tồn tại",
                    Data = null!
                };
            }
            var getAll = await _taskItemRepositories.GetAllTaskItemAsync(statusId);
            return new ApiResponse<List<AddTaskItemResponseDto>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Hiển thị thành công",
                Data = getAll.Select(p => new AddTaskItemResponseDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    CreatedAt = p.CreatedAt,
                    Status = p.Status?.StatusTask ?? string.Empty,
                    WorkType = p.WorkType,
                    Degree = p.Degree
                }).ToList()
            };
        }

        //Hiển thị chi tiết
        public async Task<ApiResponse<TaskItemDetailResponseDto>> GetTaskItemByIdAsync(int taskItemId, int userId)
        {
            var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);
            if (taskItem?.Status == null)
            {
                return new ApiResponse<TaskItemDetailResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                    Errors = new List<string>()
                };
            }
            var canAccess = await _projectRepository.CanAccessProjectAsync(taskItem.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<TaskItemDetailResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            return new ApiResponse<TaskItemDetailResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Lấy thông tin công việc thành công",
                Data = new TaskItemDetailResponseDto
                {
                    Id = taskItem.Id,
                    Title = taskItem.Title,
                    CreatedAt = taskItem.CreatedAt,
                    DueDate = taskItem.DueDate,
                    WorkType = taskItem.WorkType,
                    Degree = taskItem.Degree,
                    StatusId = taskItem.StatusId,
                    ProjectId = taskItem.Status?.ProjectId ?? 0,  //ProjectId của Status, và nếu Status là null thì dùng 0 thay vì báo lỗi.
                    CreatedByEmail = taskItem.CreatedByUser?.Email,
                    ParentId = taskItem.ParentId,
                    AssigneeId = taskItem.AssigneeId,
                    AssigneeEmail = taskItem.Assignee?.Email,
                    SubTasks = taskItem.SubTasks.Select(s => new AddTaskItemResponseDto
                    {
                        Id = s.Id,
                        Title = s.Title,
                        CreatedAt = s.CreatedAt,
                        Status = s.Status?.StatusTask ?? string.Empty,
                        Degree = s.Degree,
                        ParentId = s.ParentId
                    }).ToList()
                },
                Errors = new List<string>()
            };
        }

        // cập nhật
        public async Task<ApiResponse<UpdateTaskItemResponseDto>> UpdateTaskItemAsync(UpdateTaskItemRequestDto request, int userId, int taskItemId)
        {
            //1. validate dữ liệu
            var err = new List<string>();
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                err.Add("Không để trống tên");
            }
            if (request.CreatedAt == default)
            {
                err.Add("không để trống ngày tháng năm");
            }
            if (string.IsNullOrWhiteSpace(request.WorkType))
            {
                err.Add("không được để trong wordtype");
            }
            if (string.IsNullOrWhiteSpace(request.Degree))
            {
                err.Add("không được để trống degree");
            }
            if (err.Count > 0)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Không để trống dữ liệu",
                    Data = null!,
                    Errors = err
                };
            }

            var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);
            if (taskItem == null || taskItem.Status == null)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(taskItem.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án",
                    Data = null!
                };
            }


            var targetStatus = await _statusTaskRepository.GetStatusTaskById(request.StatusId);
            if (targetStatus == null)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Trạng thái không tồn tại",
                    Data = null!
                };
            }

            var canAccessTargetProject = await _projectRepository.CanAccessProjectAsync(targetStatus.ProjectId, userId);
            if (!canAccessTargetProject)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án",
                    Data = null!
                };
            }

            if (targetStatus.ProjectId != taskItem.Status.ProjectId)
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Bạn không thể chuyển công việc qua dự án khác",
                    Data = null!
                };
            }

            // chỉ kiểm tra khi người dùng đã nhập ngày kết thúc
            if (request.DueDate != default)
            {
                if (request.DueDate < request.CreatedAt)
                {
                    return new ApiResponse<UpdateTaskItemResponseDto>
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Status = false,
                        Message = "Ngày kết thúc không được trước ngày bắt đầu",
                        Data = null!
                    };
                }
            }

            // Chỉ cập nhật sau khi đã kiểm tra quyền
            taskItem.Title = request.Title;
            taskItem.CreatedAt = request.CreatedAt;
            taskItem.DueDate = request.DueDate;
            taskItem.WorkType = request.WorkType;
            taskItem.Degree = request.Degree;
            taskItem.StatusId = request.StatusId;

            await _taskItemRepositories.UpdateTaskItemAsync(taskItem);

            return new ApiResponse<UpdateTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Cập nhật thành công",
                Data = new UpdateTaskItemResponseDto
                {
                    Id = taskItem.Id,
                    Title = taskItem.Title,
                    CreatedAt = taskItem.CreatedAt,
                    DueDate = taskItem.DueDate,
                    WorkType = taskItem.WorkType,
                    Degree = taskItem.Degree,
                    StatusId = taskItem.StatusId
                }
            };
        }

        //Xóa
        public async Task<ApiResponse<bool>> DeleteTaskItem(int userId, int taskItemId)
        {
            //kiểm tra xem người dùng và trạng thái task có đúng không
            var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);

            if (taskItem == null || taskItem.Status == null)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc hoặc bạn không có quyền",
                    Data = false
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(taskItem.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án",
                    Data = false
                };
            }

            // Lấy danh sách file đính kèm của Task
            // Lấy danh sách file đính kèm của Task
            var attachments = await _taskAttachmentRepository.GetTaskAttachmentsAsync(taskItemId);
            // Đường dẫn thư mục lưu file
            var directory = Path.Combine(_environment.ContentRootPath, "App_Data", "TaskAttachments");
            try
            {
                // Duyệt qua từng file đính kèm
                foreach (var attachment in attachments)
                {
                    // Lấy đường dẫn file
                    var filePath = Path.Combine(directory, Path.GetFileName(attachment.StoredFileName));
                    // Kiểm tra file có tồn tại không
                    if (System.IO.File.Exists(filePath))
                    {
                        // Xóa file
                        System.IO.File.Delete(filePath);
                    }
                }
            }
            catch (Exception)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = 500,
                    Status = false,
                    Message = "Không thể xóa file đính kèm.",
                    Data = false
                };
            }
            //Xóa công việc
            await _taskItemRepositories.DeleteTaskItemReposity(taskItem);

            return new ApiResponse<bool>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Xóa công việc thành công",
                Data = true
            };
        }

        public async Task<ApiResponse<UpdateAssigneeResponseDto>> UpdateAssigneeAsync(int taskItemId, int userId, UpdateAssigneeRequestDto request)
        {
            // 1. Tìm task
            var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);
            if (taskItem == null || taskItem.Status == null)
            {
                return new ApiResponse<UpdateAssigneeResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            // 2. Kiểm tra người gọi có thuộc dự án không
            var projectId = taskItem.Status.ProjectId;
            var canAccess = await _projectRepository.CanAccessProjectAsync(projectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<UpdateAssigneeResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập dự án",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            // 3. Kiểm tra người được giao có thuộc dự án không
            string? assigneeEmail = null;
            if (request.AssigneeId != null)
            {
                var users = await _projectMemberRepository.GetProjectUsersAsync(projectId);
                var assignee = users.FirstOrDefault(u => u.Id == request.AssigneeId);

                if (assignee == null)
                {
                    return new ApiResponse<UpdateAssigneeResponseDto>
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Status = false,
                        Message = "Người được giao không thuộc dự án",
                        Data = null!,
                        Errors = new List<string>()
                    };
                }
                assigneeEmail = assignee.Email;
            }

            // 4. Lưu (AssigneeId = null nghĩa là bỏ giao)
            taskItem.AssigneeId = request.AssigneeId;
            await _taskItemRepositories.UpdateTaskItemAsync(taskItem);

            // 5. Trả kết quả
            return new ApiResponse<UpdateAssigneeResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Cập nhật người thực hiện thành công",
                Data = new UpdateAssigneeResponseDto
                {
                    TaskItemId = taskItem.Id,
                    AssigneeId = taskItem.AssigneeId,
                    AssigneeEmail = assigneeEmail
                },
                Errors = new List<string>()
            };
        }
    }
}

