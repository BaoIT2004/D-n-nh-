
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.StatusTask;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class StatusTaskService
    {
        private readonly StatusTaskRepository _statusTaskRepository;
        private readonly ProjectRepository _projectRepository;

        public StatusTaskService(
           StatusTaskRepository statusTaskRepository,
           ProjectRepository projectRepository
        )
        {
            _statusTaskRepository = statusTaskRepository;
            _projectRepository = projectRepository;
        }


        //thêm trạng thái dự án
        public async Task<ApiResponse<StatusTaskResponseDto>> AddNewStatusTaskAsync([FromBody] StatusTaskRequestDto request, int userId)
        {
            var errors = new List<string>();
            if (string.IsNullOrWhiteSpace(request.StatusTask))
                errors.Add("Tên trạng thái không được để trống");

            if (errors.Count > 0)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = null!,
                    Errors = errors
                };
            }

            var project = await _projectRepository.GetProjectByIdAsync(request.ProjectId);
            if (project == null)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                    Errors = new List<string>()
                };
            }


            var canAccess = await _projectRepository.CanAccessProjectAsync(request.ProjectId, userId);

            if (!canAccess)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không thể truy cập dự án",
                    Data = null!
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
                    Id = newStatusTask.Id,
                    StatusTask = newStatusTask.StatusTask,
                    ProjectId = newStatusTask.ProjectId
                },
                Errors = errors
            };

        }


        //Thay đổi vị trí
        public async Task<ApiResponse<ReorderStatusTaskResponseDto>> ReorderStatusAsync(int projectId, int userId, ReorderStatusTaskRequestDto request)
        {

            var project = await _projectRepository.GetProjectByIdAsync(projectId);
            if (project == null)
            {
                return new ApiResponse<ReorderStatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(projectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<ReorderStatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không thể truy cập dự án",
                    Data = null!
                };
            }

            var statusTask = await _projectRepository.GetStatusTasksByProjectIdAsync(projectId); // trả về danh sách AddStatusTask của project đó.

            var existingIds = statusTask.Select(p => p.Id).OrderBy(x => x);  //lấy danh sách ID từng phần tử trong statusTask .OrderBy(x => x) sawpx sếp theo thứ tự tăng dần x: đại diện cho từng ID. x => x: sắp xếp dựa trên chính giá trị ID đó.

            //IF
            //request.Ids.Count != statusTask.Count: số lượng Id khác số status trong DB.
            //request.Ids.OrderBy(x => x): sắp xếp Id client gửi tăng dần.
            //.SequenceEqual(existingIds): so sánh hai dãy có giống hệt nhau không.
            if (request.Ids.Count != statusTask.Count || !request.Ids.OrderBy(x => x).SequenceEqual(existingIds))
            {
                return new ApiResponse<ReorderStatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Danh sách Ids không hợp lệ",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            for (int i = 0; i < request.Ids.Count; i++) //Lặp qua từng Id client gửi, i là vị trí (0, 1, 2...).
            {
                var status = statusTask.First(s => s.Id == request.Ids[i]); //Tìm phần tử đầu tiên trong danh sách statusTask có Id bằng với ID tại vị trí i trong request.Ids, rồi lưu vào biến status.
                status.Position = i;//Gán giá trị i vào thuộc tính Position của đối tượng status.
            }

            await _projectRepository.SaveChangesAsync();//Lưu lại

            return new ApiResponse<ReorderStatusTaskResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Sắp xếp thành công",
                Data = new ReorderStatusTaskResponseDto { Ids = request.Ids },
                Errors = new List<string>()
            };
        }

        //2.Hiển thị trạng thái dự án
        public async Task<ApiResponse<List<GetAllStatusTaskResponseDto>>> GetAllStatusTasksAsync(int projectId, int userId)
        {
            var project = await _projectRepository.GetProjectByIdAsync(projectId);

            if (project == null || !await _projectRepository.CanAccessProjectAsync(projectId, userId))
            {
                return new ApiResponse<List<GetAllStatusTaskResponseDto>>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!
                };
            }

            //1.Lấy toàn bộ  trạng thái dự án
            var statusTask = await _statusTaskRepository.GetAllStatusProjectAsync(projectId, userId);
            //2.Map qua controller

            return new ApiResponse<List<GetAllStatusTaskResponseDto>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Hiển thị thành công",
                Data = statusTask.Select(st => new GetAllStatusTaskResponseDto
                {
                    Id = st.Id,
                    Status = st.StatusTask,
                    ProjectId = st.ProjectId
                }).ToList()
            };

        }

        //3.Xóa
        public async Task<ApiResponse<DaleteStatusTaskResponeDto>> DeleteStatusTaskAsync(int projectId, int userId, int statusTaskId)
        {
            var project = await _projectRepository.GetProjectByIdAsync(projectId);

            if (project == null || project.UserId != userId)
            {
                return new ApiResponse<DaleteStatusTaskResponeDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                };
            }


            var deleteStatusTaskById = await _statusTaskRepository.GetStatusTaskAsync(statusTaskId, projectId);

            if (deleteStatusTaskById == null)
            {
                return new ApiResponse<DaleteStatusTaskResponeDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy trạng thái",
                    Data = null!,
                };
            }

            await _statusTaskRepository.DeleteStatusTaskAsync(deleteStatusTaskById);

            return new ApiResponse<DaleteStatusTaskResponeDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "xóa trạng thái thành công",
                Data = new DaleteStatusTaskResponeDto
                {
                    Id = statusTaskId // trả về Id đã xóa
                },
            };
        }

        //4.Cập nhật
        public async Task<ApiResponse<StatusTaskResponseDto>> UpdateStatusTaskAsync(
            int projectId,
            int userId,
            int statusTaskId,
            UpdateStatusTaskRequestDto request)
        {

            // 1. kiểm tra project + quyền
            var projectUpdate = await _projectRepository.GetProjectByIdAsync(projectId);
            if (projectUpdate == null || projectUpdate.UserId != userId)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                };
            }

            //2. Tìm status task
            var updateStatusTask = await _statusTaskRepository.GetStatusTaskAsync(statusTaskId, projectId);

            if (updateStatusTask == null)
            {
                return new ApiResponse<StatusTaskResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy dự án",
                    Data = null!,
                };
            }
            else
            {
                updateStatusTask.StatusTask = request.StatusTask;
            }

            await _statusTaskRepository.UpdateStatusTaskAsync(updateStatusTask);

            return new ApiResponse<StatusTaskResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Cập nhật thành công",
                Data = new StatusTaskResponseDto
                {
                    Id = updateStatusTask.Id,
                    StatusTask = updateStatusTask.StatusTask,
                    ProjectId = updateStatusTask.ProjectId
                }
            };

        }
    }
}
