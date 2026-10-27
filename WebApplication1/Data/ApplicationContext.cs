using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
namespace WebApplication1.Data;

public class ApplicationContext(  // constructor
    DbContextOptions<ApplicationContext> options) : DbContext(options)
{

    public DbSet<User> Users {get; set;} // quản lý các objject user
    public DbSet<newProject>Projects{get; set;} // quản lý các objject tạo ra dự án
    public DbSet<refreshToken> RefreshTokens { get; set; }

    public DbSet<taskItem> TaskItem {get;set;}

    public DbSet<AddStatusTask> addStatusTasks {get;set;}

}
