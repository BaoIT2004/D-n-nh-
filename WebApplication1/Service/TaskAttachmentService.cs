
using Microsoft.AspNetCore.StaticFiles;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.TaskItem;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class TaskAttachmentService
    {
        private readonly TaskAttachmentRepository _taskAttachmentRepository;
        private readonly ProjectRepository _projectRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<TaskAttachmentService> _logger;
        private static readonly FileExtensionContentTypeProvider ContentTypeProvider = new();
        public TaskAttachmentService(
            TaskAttachmentRepository taskAttachmentRepository,
            ProjectRepository projectRepository,
            IWebHostEnvironment environment,
            ILogger<TaskAttachmentService> logger)
        {
            _taskAttachmentRepository = taskAttachmentRepository;
            _projectRepository = projectRepository;
            _environment = environment;
            _logger = logger;
        }

        private const long MaxFileSize = 10 * 1024 * 1024;

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
            {
                ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".docx", ".xlsx", ".txt", ".xls"
            };

        //thêm file vào dự án
        public async Task<ApiResponse<TaskAttachmentResponseDto>> UploadAsync(int taskItemId, int userId, IFormFile? file)
        {

            // tìm task
            var task = await _taskAttachmentRepository.GetTaskItemByIdAsync(taskItemId);
            if (task?.Status == null)
            {
                return new ApiResponse<TaskAttachmentResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy task",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            //có thể truy cập được không
            var canAccess = await _projectRepository.CanAccessProjectAsync(task.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<TaskAttachmentResponseDto>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập task này",
                    Data = null!,
                    Errors = new List<string> { "Bạn không có quyền truy cập task này" }
                };
            }

            if (file == null || file.Length == 0)
            {
                return new ApiResponse<TaskAttachmentResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Vui lòng chọn tệp",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            if (file.Length > MaxFileSize)
            {
                return new ApiResponse<TaskAttachmentResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Tệp không được vượt quá 10 MB",
                    Data = null!,
                    Errors = new List<string> { "Tệp không được vượt quá 10 MB" }
                };
            }

            //Kiểm tra tệp được hỗ trợ hay không
            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            {
                return new ApiResponse<TaskAttachmentResponseDto>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Status = false,
                    Message = "Tệp không hỗ trợ",
                    Data = null!,
                    Errors = new List<string>()
                };
            }



            //chuẩn bị sẵn thư mục để lưu file đính kèm của task
            //note:
            //Path.Combine(...) nối các phần lại bằng đúng dấu phân cách của hệ điều hành
            //ContentRootPath là đường dẫn tuyệt đối tới thư mục gốc của project
            //_environment là IWebHostEnvironment (hoặc IHostEnvironment), được inject qua constructor.
            //=> khi chạy trên win C:\Projects\WebApplication1\App_Data\TaskAttachments
            var directory = Path.Combine(_environment.ContentRootPath, "App_Data", "TaskAttachments");
            Directory.CreateDirectory(directory);  //tạo thư mục thật trên ổ đĩa tại đường dẫn nằm trong biến directory.


            //Guid.NewGuid(): tạo một mã định danh toàn cầu ngẫu nhiên, ví dụ 3f2504e0-4f89-11d3-9a0c-0305e82c3301.
            //:N: định dạng GUID bỏ dấu gạch ngang → 3f2504e04f8911d39a0c0305e82c3301 (32 ký tự)
            //extension.ToLowerInvariant(): chuyển phần đuôi file về chữ thường, không phụ thuộc ngôn ngữ/vùng của máy. Ví dụ .JPG → .jpg
            //$"...": string interpolation, nối hai phần lại.
            var storedFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
            var filePath = Path.Combine(directory, storedFileName);


            // new FileStream(filePath, FileMode.CreateNew): mở một luồng ghi vào file mới.
            // CreateNew nghĩa là chỉ tạo file mới; nếu file đã tồn tại thì ném IOException, không ghi đè.
            // file.CopyToAsync(stream): file là IFormFile (file người dùng upload). Dòng này sao chép nội dung file đó vào stream, tức là ghi xuống đĩa. Dùng async để không chặn thread khi đang ghi.
            //await using: khi chạy xong khối { }, stream tự được đóng và giải phóng (flush dữ liệu, trả handle file) theo kiểu bất đồng bộ. Không cần gọi Close() thủ công
            try
            {
                await using (var stream = new FileStream(filePath, FileMode.CreateNew))
                {
                    await file.CopyToAsync(stream);
                }
            }
            catch
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                throw;
            }


            if (!ContentTypeProvider.TryGetContentType(storedFileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }
            var attachment = new TaskAttachment
            {
                FileName = Path.GetFileName(file.FileName.Replace('\\', '/')), // đổi dấu \\ sang /
                StoredFileName = storedFileName,
                ContentType = contentType,  // do server quyết định
                UploadedAt = DateTimeOffset.UtcNow,
                TaskItemId = taskItemId
            };

            try
            {
                await _taskAttachmentRepository.AddTaskAttachmentAsync(attachment);
            }
            catch
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                throw;
            }

            return new ApiResponse<TaskAttachmentResponseDto>
            {
                StatusCode = StatusCodes.Status201Created,
                Status = true,
                Message = "Tải tệp lên thành công",
                Data = new TaskAttachmentResponseDto
                {
                    Id = attachment.Id,
                    FileName = attachment.FileName,
                    ContentType = attachment.ContentType,
                    UploadedAt = attachment.UploadedAt,
                    TaskItemId = attachment.TaskItemId
                },
                Errors = new List<string>()
            };
        }


        //Hiển thị
        public async Task<ApiResponse<List<TaskAttachmentResponseDto>>> GetFileAsync(int taskItemId, int userId)
        {
            var task = await _taskAttachmentRepository.GetTaskItemByIdAsync(taskItemId);

            if (task?.Status == null)
            {
                return new ApiResponse<List<TaskAttachmentResponseDto>>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(task.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<List<TaskAttachmentResponseDto>>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập task này",
                    Data = null!,
                    Errors = new List<string> { "Bạn không có quyền truy cập task này" }
                };
            }

            var attachments = await _taskAttachmentRepository.GetTaskAttachmentsAsync(taskItemId);

            return new ApiResponse<List<TaskAttachmentResponseDto>>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Lấy danh sách tệp đính kèm thành công",
                Data = attachments.Select(attachment => new TaskAttachmentResponseDto
                {
                    Id = attachment.Id,
                    FileName = attachment.FileName,
                    UploadedAt = attachment.UploadedAt,
                    ContentType = attachment.ContentType,
                    TaskItemId = attachment.TaskItemId
                }).ToList(),
                Errors = new List<string>()
            };
        }

        //Xóa file vào dự án
        public async Task<ApiResponse<bool>> DeleteAsync(int attachmentId, int userId)
        {
            var attachment = await _taskAttachmentRepository.GetAttachmentAsync(attachmentId);

            if (attachment == null)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "không tìm thấy file",
                    Data = false,
                    Errors = new List<string>()
                };
            }


            // tìm công việc
            var task = await _taskAttachmentRepository.GetTaskItemByIdAsync(attachment.TaskItemId);

            if (task?.Status == null)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "không tìm thấy công việc",
                    Data = false,
                    Errors = new List<string>()
                };
            }

            // có thể truy cập được không
            var canAccess = await _projectRepository.CanAccessProjectAsync(task.Status.ProjectId, userId);

            if (!canAccess)
            {
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "bạn không có quyền truy cập công việc",
                    Data = false,
                    Errors = new List<string>()
                };
            }
            //note:
            // environment.ContentRootPath: đường dẫn thư mục gốc của project backend.
            // "App_Data": thư mục chứa dữ liệu của ứng dụng.
            // "TaskAttachments": thư mục chứa các file đính kèm của TaskItem.
            var directory = Path.Combine(_environment.ContentRootPath, "App_Data", "TaskAttachments");

            // attachment.StoredFileName Là tên file được lưu trong database.
            // Path.GetFileName() Lấy riêng tên file, bỏ phần đường dẫn nếu có.

            var filePath = Path.Combine(directory, Path.GetFileName(attachment.StoredFileName));

            try
            {
                if (File.Exists(filePath)) // File.Exists hàm có sẵn trogn C# kiểm tra xem có file hay không
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Không xóa được file {FilePath}", filePath);
                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Status = false,
                    Message = "Không thể xóa file trên máy chủ. Vui lòng thử lại.",
                    Data = false,
                    Errors = new List<string> { "Lỗi xóa file vật lý" }
                };
            }

            //B2: Xóa dữ liệu trong Database
            try
            {
                await _taskAttachmentRepository.DeleteAttachmentAsync(attachment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Không thể xóa thông tin attachment");

                return new ApiResponse<bool>
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Status = false,
                    Message = "File đã xóa nhưng không thể xóa thông tin trong Database. Vui lòng thử lại.",
                    Data = false
                };
            }

            return new ApiResponse<bool>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Xóa tệp đính kèm thành công",
                Data = true,
                Errors = new List<string>()
            };
        }


        public async Task<ApiResponse<FileDownloadDtoResponse>> DownloadAsync(int id, int userId)
        {
            var attachment = await _taskAttachmentRepository.GetAttachmentAsync(id);

            if (attachment == null)
            {
                return new ApiResponse<FileDownloadDtoResponse>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "không tìm thấy file",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var task = await _taskAttachmentRepository.GetTaskItemByIdAsync(attachment.TaskItemId);
            if (task?.Status == null)
            {
                return new ApiResponse<FileDownloadDtoResponse>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "Không tìm thấy công việc",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var canAccess = await _projectRepository.CanAccessProjectAsync(task.Status.ProjectId, userId);
            if (!canAccess)
            {
                return new ApiResponse<FileDownloadDtoResponse>
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Status = false,
                    Message = "Bạn không có quyền truy cập task này",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var directory = Path.Combine(_environment.ContentRootPath, "App_Data", "TaskAttachments");
            var filePath = Path.Combine(directory, Path.GetFileName(attachment.StoredFileName));

            if (!File.Exists(filePath))
            {
                return new ApiResponse<FileDownloadDtoResponse>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Status = false,
                    Message = "File không còn tồn tại trên máy chủ",
                    Data = null!,
                    Errors = new List<string>()
                };
            }

            var bytes = await File.ReadAllBytesAsync(filePath);
            return new ApiResponse<FileDownloadDtoResponse>
            {
                StatusCode = StatusCodes.Status200OK,
                Status = true,
                Message = "Tải tệp thành công",
                Data = new FileDownloadDtoResponse
                {
                    FileName = attachment.FileName,
                    ContentType = attachment.ContentType,
                    FileContent = bytes
                },
                Errors = new List<string>()
            };
        }
    }
}
