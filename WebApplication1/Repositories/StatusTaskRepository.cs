

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class StatusTaskRepository
{
    private readonly ApplicationContext _dbContext;

    public StatusTaskRepository(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddStatusTaskAsync(AddStatusTask addStatusTask)
    {
        await _dbContext.AddStatusTasks.AddAsync(addStatusTask);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<AddStatusTask>> GetAllStatusProjectAsync(int projectId, int userId)
    {
        return await _dbContext.AddStatusTasks.Where(p => p.ProjectId == projectId && p.Project!.UserId == userId).ToListAsync();
    }

    public async Task DeleteStatusTaskAsync(AddStatusTask addStatusTask)
    {
        _dbContext.AddStatusTasks.Remove(addStatusTask);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<AddStatusTask?> getStatusTaskAsync(int statusTaskId, int projectId)
    {
        return await _dbContext.AddStatusTasks.FirstOrDefaultAsync(p => p.Id == statusTaskId && p.ProjectId == projectId);
    }

    

    public async Task UpdateStatusTaskAsync(AddStatusTask statusTask)
    {
        _dbContext.AddStatusTasks.Update(statusTask);
        await _dbContext.SaveChangesAsync();
    }

    // TÌm status số mấy 
    public async Task<AddStatusTask?> GetStatusTaskById (int id)
    {
        return await _dbContext.AddStatusTasks.Include(s=> s.Project).FirstOrDefaultAsync(p => p.Id == id);
    }

   
}
