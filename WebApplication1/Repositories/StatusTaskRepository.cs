

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

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

    public async Task<List<AddStatusTask>> GetAllStatusProjectAsync(int projectId)
    {
        return await _dbContext.AddStatusTasks.Where(p => p.ProjectId == projectId).ToListAsync();
    }

}
