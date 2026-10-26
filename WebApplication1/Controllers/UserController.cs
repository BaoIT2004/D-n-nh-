using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Service;
using WebApplication1.DTOs.ApiResponse;
using Microsoft.AspNetCore.Authorization;



namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ApplicationContext dbContext;
        private readonly PasswordService passwordService;

        private readonly JwtService _jwtService;

        public UserController(ApplicationContext dbContext, PasswordService passwordService, JwtService jwtService)
        {
            this.dbContext = dbContext;
            this.passwordService = passwordService;
            _jwtService = jwtService;
        }

        // Hiển thị người dùng
        [HttpGet]
        public IActionResult GetAllUser()
        {
            var allUser = dbContext.Users.ToList();
            return Ok(allUser); //ok ở đây là trả về danh sách
        }

        // Thêm người dùng (đăng kí tài khoản)
        [HttpPost("register")]
        public IActionResult AddUser(User user)
        {
            var users = new User
            {
                Name = user.Name,
                Email = user.Email,
                passWord = passwordService.HashPassword(user.passWord)
            };

            var myEmail = dbContext.Users.Any(x => x.Email == user.Email); // kiểm tra email có trong db hay chưa
            if (myEmail)
            {
                var errorResponse = new ApiResponse<object>
                {
                    StatusCode = 409,
                    Status = false,
                    Message = "Email đã được sử dụng",
                    Data = null,
                    Errors = new List<string>
                        {
                        "Vuii lòng dùng Email khác"
                        }
                };
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }


            dbContext.Users.Add(users);
            dbContext.SaveChanges(); // lưu dữ liệu đã thay đổi hiện tại xuống db

            var successResponse = new ApiResponse<object>
            {
                StatusCode = 201,
                Status = true,
                Message = "Đăng ký tài khoản thành công",
                Data = new
                {
                    users.Name,
                    users.Email
                }
            };
            return StatusCode(successResponse.StatusCode, successResponse);
        }


        // Đăng nhập tài khoản
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(User login)
        {
            if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.passWord))
            {
                var errorResponse = new ApiResponse<object>
                {
                    StatusCode = 409,
                    Status = false,
                    Message = "Email đã được sử dụng",
                    Data = null,
                    Errors = new List<string>
                        {
                        "Email không được để trống",
                        "Mật khẩu không được để trống"
                        }
                };
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }

            var myUser = dbContext.Users.Where(x => x.Email == login.Email).FirstOrDefault();

            if (myUser == null || !passwordService.VerifyPassword(login.passWord, myUser.passWord))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new ApiResponse<object>
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Status = false,
                    Message = "Email hoặc mật khẩu không đúng",
                    Data = null,
                    Errors = new List<string> { "Email hoặc mật khẩu không đúng" }
                });
            }
            var token = await _jwtService.GenerateToken(myUser);

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Status = true,
                Message = "Đăng nhập thành công",
                Data = new
                {
                    id = myUser.Id,
                    myUser.Name,
                    myUser.Email,
                    accessToken = token.Tokens,
                    refreshToken = token.RefreshToken
                },
            });
        }

        // Chưa hiểu 
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
                accessToken = token.Tokens,
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