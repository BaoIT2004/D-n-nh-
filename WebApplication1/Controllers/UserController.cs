using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Service;

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
            return Ok(new {}); //ok ở đây là trả về danh sách
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

            var myEmail = dbContext.Users.Any(x => x.Email == user.Email);
            if (myEmail)
            {
               return BadRequest("Email đã tồn tại");
            }

            dbContext.Users.Add(users);
            dbContext.SaveChanges();
            return Ok(new {users.Id, users.Name, users.Email});
        }

        // Đăng nhập tài khoản
        [HttpPost("login")]
        public IActionResult Login(User login)
        {
            var myUser = dbContext.Users.Where(x =>x.Email == login.Email).FirstOrDefault();

            if(myUser != null && passwordService.VerifyPassword(login.passWord, myUser.passWord))
            {
                Console.WriteLine("Đăng nhập thành công");
                return Ok();
            }
            else
            {
                Console.WriteLine("Đăng nhập thất bại");
                return BadRequest();
            }
        }

    }
}