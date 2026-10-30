

using WebApplication1.Data;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Models;
using WebApplication1.Repositories;

public class TaskItemService
{
    private readonly ApplicationContext _dbcontext;
    private readonly TaskItemRepositories _taskItemRepositories;

    private readonly StatusTaskRepository _statusTaskRepository;

    public TaskItemService(ApplicationContext dbcontext,
    TaskItemRepositories taskItemRepositories,
    StatusTaskRepository statusTaskRepository)
    {
        _dbcontext = dbcontext;
        _taskItemRepositories = taskItemRepositories;
        _statusTaskRepository = statusTaskRepository;
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

        if (response == null || response.Project == null || response.Project.UserId != userId)
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
            StatusId = response.Id
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

        if (status == null || status.Project?.UserId != userId) //status.Project?.UserId != userId:Kiểm tra xem Project chứa Status này có thuộc về người dùng đang đăng nhập hay không.
        {
            return new ApiResponse<List<AddTaskItemResponseDto>>
            {
                StatusCode = StatusCodes.Status404NotFound,
                Status = false,
                Message = "Không có dự án để hiển thị",
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
    public async Task<ApiResponse<AddTaskItemResponseDto>> UpdateTaskItemService(UpdateTaskItemkRequestDto request, int userId, int taskItemId)
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

        var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);

        if (taskItem == null || taskItem.Status?.Project?.UserId != userId)
        {
            {
                return new ApiResponse<AddTaskItemResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                };
            }
        }

        var targetStatus = await _statusTaskRepository.GetStatusTaskById(request.StatusId);
        if (targetStatus == null || targetStatus.Project?.UserId != userId)
        {
            return new ApiResponse<AddTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status404NotFound,
                Status = false,
                Message = "Trạng thái không tồn tại",
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

        return new ApiResponse<AddTaskItemResponseDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Status = true,
            Message = "Cập nhật thành công",
            Data = new AddTaskItemResponseDto
            {
                Id = taskItem.Id,
                Title = taskItem.Title,
                CreatedAt = taskItem.CreatedAt,
                WorkType = taskItem.WorkType,
                Degree = taskItem.Degree
            }
        };
    }

    //Xóa
    public async Task<ApiResponse<AddTaskItemResponseDto>> DeleteTaskItem(int userId, int taskItemId)
    {
        //kiểm tra xem người dùng và trạng thái task có đúng không
        var taskItem = await _taskItemRepositories.GetStatusItemAsync(taskItemId);

        if (taskItem == null || taskItem.Status?.Project?.UserId != userId)
        {
            return new ApiResponse<AddTaskItemResponseDto>
            {
                StatusCode = StatusCodes.Status404NotFound,
                Status = false,
                Message = "Không tìm thấy công việc hoặc bạn không có quyền",
                Data = null!
            };
        }

        //Xóa dự án 
        await _taskItemRepositories.DeleteTaskItemReposity(taskItem);

        return new ApiResponse<AddTaskItemResponseDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Status = true,
            Message = "Xóa công việc thành công",
            Data = null!
        };
    }

}