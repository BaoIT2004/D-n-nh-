using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Service;
using WebApplication1.DTOs.ApiResponse;
using WebApplication1.Exceptions;


namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ApplicationContext dbContext;
        private readonly PasswordService passwordService;

        public UserController(ApplicationContext dbContext, PasswordService passwordService)
        {
            this.dbContext = dbContext;
            this.passwordService = passwordService;
        }

        // Hiển thị người dùng
        [HttpGet]
        public IActionResult GetAllUser()
        {
            var allUser = dbContext.Users.ToList();
            return Ok(new { }); //ok ở đây là trả về danh sách
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
        public IActionResult Login(User login)
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

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Status = true,
                Message = "Đăng nhập thành công",
                Data = new
                {
                    myUser.Name,
                    myUser.Email
                },
                Errors = new List<string>()
            });
        }



        [HttpGet("test-errs")]
        public IActionResult TestError()
        {
            throw new Exception("Lỗi hệ thống thử nghiệm");
        }

    

        [HttpGet("test-null")]
        public IActionResult TestNull()
        {
            string s = null;
            return Ok(s.Length);
        }

    }
}