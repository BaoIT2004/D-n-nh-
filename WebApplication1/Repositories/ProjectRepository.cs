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
            await _dbContext.Project.AddAsync(newProject);
            await _dbContext.SaveChangesAsync();
        }
    }

}