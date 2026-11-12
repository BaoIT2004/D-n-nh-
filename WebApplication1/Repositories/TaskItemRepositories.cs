

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;


namespace WebApplication1.Repositories
{
    public class TaskItemRepositories
    {
        private readonly ApplicationContext _dbcontext;

        public TaskItemRepositories(
            ApplicationContext dbcontext
        )
        {
            _dbcontext = dbcontext;
        }

        public async Task AddTaskItem(TaskItem taskItem)
        {
            await _dbcontext.TaskItem.AddAsync(taskItem);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<TaskItem>> GetAllTaskItemAsync(int statusId)
        {
            return await _dbcontext.TaskItem
            .Include(task => task.Status)
            .Where(task => task.StatusId == statusId && task.ParentId == null) //ParentId == null là điều kiện lọc task gốc. Trong DB, task gốc không có cha nên cột ParentId để null; subtask thì ParentId mang Id của cha.
            .ToListAsync();
        }

            public async Task UpdateTaskItemAsync(TaskItem taskItem)
            {
                _dbcontext.TaskItem.Update(taskItem);
                await _dbcontext.SaveChangesAsync();
            }

        // Include(p => p.Status): lấy thông tin Status.
        // ThenInclude(status => status!.Project): lấy tiếp Project thuộc Status.
        // Include(p => p.CreatedByUser): lấy người tạo Task.
        public async Task<TaskItem?> GetStatusItemAsync(int taskItemId)
        {
            return await _dbcontext.TaskItem
                .Include(p => p.Status)
                .ThenInclude(status => status!.Project)
                .Include(p => p.CreatedByUser)
                .Include(p => p.Assignee)
                .Include(p => p.SubTasks)
                .ThenInclude(s => s.Status)
                .FirstOrDefaultAsync(p => p.Id == taskItemId);
        }
        public async Task<TaskItem?> GetTaskItemByStatusIdAsync(int statusId)
        {
            return await _dbcontext.TaskItem.FirstOrDefaultAsync(p => p.StatusId == statusId);
        }
        public async Task DeleteTaskItemReposity(TaskItem taskItem)
        {
            _dbcontext.TaskItem.Remove(taskItem);
            await _dbcontext.SaveChangesAsync();
        }

        public Task<TaskItem?> GetTaskItemAsync(int taskItemId)
        {
            return _dbcontext.TaskItem.Include(t => t.Status).FirstOrDefaultAsync(task => task.Id == taskItemId);
        }
    }
}
