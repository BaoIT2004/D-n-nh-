using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class TaskAttachmentRepository
    {
        public readonly ApplicationContext _dbContext;

        public TaskAttachmentRepository(ApplicationContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public Task<TaskItem?> GetTaskItemAsync(int taskItemId)
        {
            return _dbContext.TaskItem.Include(t => t.Status).FirstOrDefaultAsync(task => task.Id == taskItemId);
        }

        //hàm lấy attachment
        public Task<TaskAttachment?> GetAttachmentAsync(int attachmentId)
        {
            return _dbContext.TaskAttachments.FirstOrDefaultAsync(a => a.Id == attachmentId);
        }

        // 1. Thêm
        public async Task AddTaskAttachmentAsync(TaskAttachment attachment)
        {
            await _dbContext.TaskAttachments.AddAsync(attachment);
            await _dbContext.SaveChangesAsync();
        }

        // 2.Xóa
        public async Task DeleteAttachmentAsync(TaskAttachment taskAttachment)
        {
            _dbContext.TaskAttachments.Remove(taskAttachment);
            await _dbContext.SaveChangesAsync();
        }

    }
}