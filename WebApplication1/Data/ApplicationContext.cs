using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using static System.Net.WebRequestMethods;
namespace WebApplication1.Data;

public class ApplicationContext(  // constructor
    DbContextOptions<ApplicationContext> options,
    IHttpContextAccessor httpContextAccessor) : DbContext(options)
{

    public DbSet<User> Users { get; set; } // quản lý các objject user
    public DbSet<newProject> Projects { get; set; } // quản lý các objject tạo ra dự án
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<TaskItem> TaskItem { get; set; }

    public DbSet<AddStatusTask> AddStatusTasks { get; set; }

    public DbSet<ProjectMember> ProjectMembers { get; set; }

    public DbSet<TaskAttachment> TaskAttachments { get; set; }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var userId = httpContextAccessor.HttpContext?.Items["userId"] as int?;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.CreatedId = userId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedId = userId;

                entry.Property(x => x.CreatedAt).IsModified = false;
                entry.Property(x => x.CreatedId).IsModified = false;
            }
        }
        return base.SaveChangesAsync(ct);
    }

}
