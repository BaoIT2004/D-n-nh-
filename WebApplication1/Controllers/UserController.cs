using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Service;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;



namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ApplicationContext dbContext;
        private readonly PasswordService passwordService;
        private readonly JwtService _jwtService;
        private readonly UserService _userService;

        public UserController(
            ApplicationContext dbContext,
            PasswordService passwordService,
            JwtService jwtService,
            UserService userService)
        {
            this.dbContext = dbContext;
            this.passwordService = passwordService;
            _jwtService = jwtService;
            _userService = userService;
        }

        // Hiển thị người dùng
        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            // var allUser = dbContext.Users.ToList();
            // return Ok(allUser); //ok ở đây là trả về danh sách
            var response = await _userService.GetAllUsersAsync();
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
            return StatusCode(response.StatusCode, response);
        }















        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return BadRequest("token không hợp lệ");
            }

            var token = await _jwtService.ValidateToken(request.RefreshToken);
            if (token is null)
            {
                return Unauthorized("Refresh token không hợp lệ hoặc đã hết hạn");
            }

            return Ok(new
            {
                accessToken = token.AccessToken,
                refreshToken = token.RefreshToken
            });
        }



        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return BadRequest("Refresh token không được để trống");
            }

            var revoked = await _jwtService.logoutRefreshtoken(request.RefreshToken);
            if (!revoked)
            {
                return Unauthorized("Refresh token không hợp lệ");
            }

            return Ok(new { message = "Đăng xuất thành công" });
        }

    }
}