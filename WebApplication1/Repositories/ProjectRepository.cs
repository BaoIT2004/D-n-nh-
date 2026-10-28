using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ProjectRepository
    {
        public readonly ApplicationContext _dbContext;

        public ProjectRepository(ApplicationContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public async Task AddProjectAsync(NewProject newProject)
        {
            await _dbContext.Projects.AddAsync(newProject);
            await _dbContext.SaveChangesAsync();
        }

        public Task<List<NewProject>> GetAllProjectAsync()
        {
            return _dbContext.Projects.ToListAsync();
        }

        public async Task UpdateProjectAsync(NewProject newProject)
        {
            _dbContext.Projects.Update(newProject);
            await _dbContext.SaveChangesAsync();
        }
    }

}