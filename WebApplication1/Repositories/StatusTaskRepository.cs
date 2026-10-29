

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
 }   
