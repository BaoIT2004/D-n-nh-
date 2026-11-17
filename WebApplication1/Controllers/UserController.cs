using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs.Auth;
using WebApplication1.Models;
using WebApplication1.Service;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly JwtService _jwtService;
        private readonly UserService _userService;

        public UserController(
            JwtService jwtService,
            UserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }


        private void SetRefreshCookie(string refreshToken)  // private chỉ dùng đươc trong class
        {
            //Thêm Cookie vào HTTP Response để gửi về trình duyệt (tên cookie , giá trị lưu cookie , cấu hình cookie)
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,  //JavaScript không thể đọc Cookie bằng document.cookie. Giúp hạn chế tấn công XSS lấy Refresh Token.
                Secure = true,  //	Chỉ gửi Cookie qua kết nối HTTPS.
                SameSite = SameSiteMode.Strict,  //Hạn chế gửi Cookie trong các request xuất phát từ website khác, giúp chống CSRF.
                Expires = DateTime.UtcNow.AddDays(7)  //Cookie hết hạn sau 7 ngày kể từ thời điểm hiện tại.
            });
        }

        private void DeleteRefreshCookie()
        {
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });  // gửi yêu cầu xóa cookies về trình duyệt (tên cookie là RefreshToken)
        }

        // Hiển thị thông tin người dùng
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _userService.GetCurrentUserAsync(userId);
            return StatusCode(response.StatusCode, response);
        }


        // Đăng ký tài khoản
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var response = await _userService.RegisterAsync(request);
            return StatusCode(response.StatusCode, response);
        }


        // Đăng nhập tài khoản
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var response = await _userService.LoginAsync(request);

            if (response.StatusCode == 200)
            {
                SetRefreshCookie(response.Data.RefreshToken);// Lưu Refresh Token vào Cookie HttpOnly
                response.Data.RefreshToken = null!;  // Không trả Refresh Token trong JSON Response
            }
            return StatusCode(response.StatusCode, response);
        }

        //Đăng xuất
        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = await _userService.LogoutAsync(refreshToken ?? string.Empty);

            DeleteRefreshCookie();
            return StatusCode(response.StatusCode, response);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized("Không có refresh token");

            var response = await _userService.RefreshAsync(refreshToken);

            if (response.StatusCode != 200)
            {
                DeleteRefreshCookie();
                return StatusCode(response.StatusCode, response);
            }

            SetRefreshCookie(response.Data.RefreshToken);
            response.Data.RefreshToken = null!;
            return StatusCode(response.StatusCode, response);
        }
    }
}
