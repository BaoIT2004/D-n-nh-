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

    public DbSet<ProjectManger> ProjectMembers { get; set; }

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

    //xóa ẩn dựa án

    //Note
    //protected: chỉ người trong gia đinh mới dùng được class con dùng được
    //overide: DbContext đã có sẵn hàm OnModelCreating (để trống). Bạn viết lại nó để thêm quy tắc riêng.
    //void không trả về giá trị
    //ModelBuilder modelBuilder: EF đưa công cụ xây mô hình Mọi cấu hình đều làm qua biến này.
    //
    protected override void OnModelCreating(ModelBuilder modelBuilder)  //
    {
        base.OnModelCreating(modelBuilder);
        //tôi muốn cấu hình cho entity newProject” (bảng Projects).
        //gắn một điều kiện lọc cho bảng này.
        //p là một project.
        //!p.DelFlag nghĩa là DelFlag phải là false.
        modelBuilder.Entity<newProject>().HasQueryFilter(p => !p.DelFlag);
        modelBuilder.Entity<ProjectManger>().HasQueryFilter(pm => !pm.Project.DelFlag);
    }

}
