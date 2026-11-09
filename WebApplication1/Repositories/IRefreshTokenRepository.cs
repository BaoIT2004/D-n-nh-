using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task Create(RefreshToken token);
        Task Delete(RefreshToken refreshToken);
        Task<RefreshToken?> Get(string token);
    }
}
