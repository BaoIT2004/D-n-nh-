using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
namespace WebApplication1.Data;

public class ApplicationContext : DbContext
{
    public ApplicationContext(  // constructor
        DbContextOptions<ApplicationContext> options) // nhận thông tin cấu hình // ?
        : base(options) {} // đưa cho dbcontext

    public DbSet<User> Users {get; set;} // quản lý các objject user
    public DbSet<newProject>Projects{get; set;} // quản lý các objject tạo ra dự án
    public DbSet<refreshToken> RefreshTokens { get; set; }

}
