using System.Security.Claims;
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

        // Hiển thị người dùng
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetAllUser()
        {
            var user = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _userService.GetAllUsersAsync(user);
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

        //Đăng xuất
        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutResquestDto request)
        {
            var response = await _userService.Logout(request);

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
    }
}
