using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ProjectMemberRepository
    {
        private readonly ApplicationContext _dbContext;

        public ProjectMemberRepository(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<User?> GetUserByEmailAsync(string email)
        {
            return _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public Task<bool> IsMemberAsync(int projectId, int userId)
        {
            return _dbContext.ProjectMembers.AnyAsync(member => member.ProjectId == projectId && member.UserId == userId);
        }

        public async Task<ProjectMember> AddMemberAsync(ProjectMember member)
        {
            await _dbContext.ProjectMembers.AddAsync(member);
            await _dbContext.SaveChangesAsync();
            return member;
        }
    }
}
