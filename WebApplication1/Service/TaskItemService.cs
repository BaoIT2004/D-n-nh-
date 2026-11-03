

using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;
using WebApplication1.Repositories;

public class TaskItemService
{
    private readonly ApplicationContext _dbcontext;
    private readonly TaskItemRepositories _taskItemRepositories;

    private readonly StatusTaskRepository _statusTaskRepository;

    private readonly ProjectRepository _projectRepository;

    public TaskItemService(ApplicationContext dbcontext,
    TaskItemRepositories taskItemRepositories,
    StatusTaskRepository statusTaskRepository,
    ProjectRepository projectRepository)
    {
        _dbcontext = dbcontext;
        _taskItemRepositories = taskItemRepositories;
        _statusTaskRepository = statusTaskRepository;
        _projectRepository = projectRepository;
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
        if (request.CreatedAt == default)
        {
            err.Add("không để trống ngày tháng năm");
        }
        if (string.IsNullOrWhiteSpace(request.WorkType))
        {
            err.Add("không được để troog wordtype");
        }
        if (string.IsNullOrWhiteSpace(request.Degree))
        {
            err.Add("không được để trống degree");
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
        if (response == null || !await _projectRepository.CanAccessProjectAsync(response.ProjectId, userId))
        {
            return new ApiResponse<AddTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status404NotFound,
                Status = false,
                Message = "Trạng thái không tồn tại",
                Data = null!,
                Errors = err
            };
        }

        // tạo mới 
        var newTaskItem = new TaskItem
        {
            Title = request.Title,
            CreatedAt = request.CreatedAt,   // DateOnly
            WorkType = request.WorkType,
            Degree = request.Degree,
            StatusId = statusTaskId
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
                WorkType = newTaskItem.WorkType,
                Degree = newTaskItem.Degree,
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
                Message = "Trạng thái không tồi tại",
                Data = null!
            };
        }

        var getAll = await _taskItemRepositories.GetAllTaskItemAsync(statusId, userId);

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
                WorkType = p.WorkType,
                Degree = p.Degree
            }).ToList()
        };
    }

    // cập nhật
    public async Task<ApiResponse<UpdateTaskItemResponseDto>> UpdateTaskItemService(UpdateTaskItemRequestDto request, int userId, int taskItemId)
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
            err.Add("không được để troog wordtype");
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
            {
                return new ApiResponse<UpdateTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                };
            }
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

        if(targetStatus.ProjectId != taskItem.Status.ProjectId)
        {
             return new ApiResponse<UpdateTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Status = false,
                Message = "Bạn không thể chuyển công việc qua dựa án khác",
                Data = null!
            };
        }

        // Chỉ cập nhật sau khi đã kiểm tra quyền
        taskItem.Title = request.Title;
        taskItem.CreatedAt = request.CreatedAt;
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
                Title = taskItem.Title,
                CreatedAt = taskItem.CreatedAt,
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

        //Xóa dự án 
        await _taskItemRepositories.DeleteTaskItemReposity(taskItem);

        return new ApiResponse<bool>
        {
            StatusCode = StatusCodes.Status200OK,
            Status = true,
            Message = "Xóa công việc thành công",
            Data = true
        };
    }

}