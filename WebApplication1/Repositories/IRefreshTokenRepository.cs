using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task Create(refreshToken token);
        Task Delete(refreshToken refreshToken);
        Task<refreshToken?> Get(string token);
    }
}