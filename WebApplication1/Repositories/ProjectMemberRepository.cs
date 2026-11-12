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

        public async Task<List<User>> GetProjectUsersAsync(int projectId)
        {
            var owners = await _dbContext.Projects.Where(p => p.Id == projectId && p.User != null).Select(p => p.User!).ToListAsync();
            var member = await _dbContext.ProjectMembers.Where(x => x.ProjectId == projectId && x.User != null).Select(x => x.User!).ToListAsync();
            return owners.Concat(member).DistinctBy(u => u.Id).ToList(); //DistinctBy loại bỏ trùng theo Id (phòng trường hợp chủ project cũng nằm trong bảng thành viên).
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
