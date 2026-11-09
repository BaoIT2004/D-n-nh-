using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationContext _dbContext;

        public RefreshTokenRepository(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Create(RefreshToken token)
        {
            _dbContext.RefreshTokens.Add(token);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(RefreshToken token)
        {
            _dbContext.RefreshTokens.Remove(token);
            await _dbContext.SaveChangesAsync();
        }

        public Task<RefreshToken?> Get(string token)
        {
            return _dbContext.RefreshTokens
                .FirstOrDefaultAsync(refreshToken => refreshToken.TokenHash == token);
        }
    }
}
