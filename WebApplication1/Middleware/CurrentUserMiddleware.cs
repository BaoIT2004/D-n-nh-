using System.Security.Claims;
using WebApplication1.Models;

namespace WebApplication1.MiddleWare;

public class CurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public CurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)  //mỗi lần có request. context chứa mọi thông tin về request đó.
    {
        var idStr = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // lấy thông tin người dùng hiện tại đang gửi httprequest . Tìm Claim có tên NameIdentifier,Claim này thường được dùng để lưu ID người dùng.
        if (int.TryParse(idStr, out var id)) //idStr từ kiểu chuỗi (string) sang số nguyên (int). out var id	Nhận kết quả sau khi chuyển đổi
        {
            context.Items["userId"] = id;  // item là túi tạm sống trong request bỏ userId vào cái túi để nơi khác sử dụng
        }
        await _next(context);  //chạy mdw tiếp theo
    }
}
