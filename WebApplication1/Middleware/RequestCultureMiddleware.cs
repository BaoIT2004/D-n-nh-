using System.Net;
using System.Text.Json;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Exceptions;

namespace Middleware.Example;

public class RequestCultureMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestCultureMiddleware> _logger;

    public RequestCultureMiddleware(RequestDelegate next, ILogger<RequestCultureMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }

        catch (Exception ex)
        {
            //_logger có tác dụng ghi lại thông tin hoạt động, cảnh báo và lỗi của ứng dụng
            _logger.LogError(ex, "Lỗi xử lý request phương thức: {method}, đường dẫn: {path}", context.Request.Method, context.Request.Path);
            int statusCode;
            string message;
            if (context.Response.HasStarted) //kiểm tra server đã bắt đầu gửi http response về client chư
            {
                throw; //Ném lại ngoại lệ đang được xử lý trong catch, giữ nguyên lỗi ban đầu và thông tin về nơi phát sinh lỗi.
            }
            else if (ex is LoginException)
            {
                statusCode = StatusCodes.Status401Unauthorized;
                message = ex.Message;
            }
            else
            {
                statusCode = StatusCodes.Status500InternalServerError;
                message = ex.Message;
            }
            await HandleExceptionAsync(context, statusCode, message); // InternalServerError = 500  (int)HttpStatusCode.InternalServerError
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.Clear(); //xóa câu thông báo cũ của server để chuẩn bị trả lời lại bằng thông báo lỗi.
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json"; // báo client dữ liệu server là json

        var response = new ApiResponse<object>
        {
            StatusCode = statusCode,
            Status = false,
            Message = message,
            Data = null,
            Errors = new List<string> { message }
        };

        var result = JsonSerializer.Serialize(response, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        return context.Response.WriteAsync(result);
    }
}
