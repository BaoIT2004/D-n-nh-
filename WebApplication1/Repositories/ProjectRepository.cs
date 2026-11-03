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

        public async Task AddProjectAsync(newProject newProject)
        {
            await _dbContext.Projects.AddAsync(newProject);
            await _dbContext.SaveChangesAsync();
        }

        //p.UserId == UserId: hỏi “project này của ai?
        public Task<List<newProject>> GetAllProjectAsync(int userId)
        {
            return _dbContext.Projects.Where(p => p.UserId == userId || p.ProjectMembers
                .Any(member => member.UserId == userId))
                .ToListAsync();
        }

        public async Task UpdateProjectAsync(newProject newProject) 
        {
            _dbContext.Projects.Update(newProject);
            await _dbContext.SaveChangesAsync();
        }

        //p.Id == id: có nghĩa là đây là project số mấy
        public async Task<newProject?> GetProjectByIdAsync (int id)
        {
            return await _dbContext.Projects.FirstOrDefaultAsync(p=>p.Id == id);
        }


        public async Task DeleteProjectAsync(newProject newProject)
        {
            _dbContext.Projects.Remove(newProject);
            await _dbContext.SaveChangesAsync();
        }


        public Task<bool>CanAccessProjectAsync(int projectId, int userId)
        {
            return _dbContext.Projects.AnyAsync(project =>
                project.Id == projectId &&
                (project.UserId == userId ||
                 project.ProjectMembers.Any(member => member.UserId == userId)));
        }


    }

}