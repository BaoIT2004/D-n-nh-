

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

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

    public async Task<List<TaskItem>> GetAllTaskItemAsync(int statusId, int userId)
    {
        return await _dbcontext.TaskItem.Where(p => p.StatusId == statusId && p.Status!.Project!.UserId == userId).ToListAsync(); //TaskItem không có UserId trực tiếp, nên phải đi qua Status rồi Project mới biết task này thuộc user nào
    }

    public async Task UpdateTaskItemAsync(TaskItem taskItem)
    {
        _dbcontext.TaskItem.Update(taskItem);
        await _dbcontext.SaveChangesAsync();
    }

    public async Task<TaskItem?> GetStatusItemAsync(int statusItemId)
    {
        return await _dbcontext.TaskItem.Include(p => p.Status!.Project).FirstOrDefaultAsync(p => p.Id == statusItemId);
    }


    public async Task<TaskItem?> TaskItemAsync(int statusId){
        return await _dbcontext.TaskItem.FirstOrDefaultAsync(p => p.StatusId == statusId);        
    }


    public async Task DeleteTaskItemReposity(TaskItem taskItem)
    {
        _dbcontext.TaskItem.Remove(taskItem);
        await _dbcontext.SaveChangesAsync();
    }
}