using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class UserRepository
{
    private readonly ApplicationContext _dbContext;

    public UserRepository(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<User?> Get(int userId)
    {
        return _dbContext.Users.FirstOrDefaultAsync(user => user.Id == userId);
    }


    //Lấy dữ liệu → thường trả về Task<User?>, vì có dữ liệu cần nhận.
    public Task<User?> GetByEmailAsync(string email)
    {
        return _dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);
    }

    //Thêm, sửa, xóa → thường trả về Task, nếu không cần nhận lại dữ liệu.
    public async Task AddUserAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public Task<List<User>> GetAllAsync() //List<User>: Danh sách nhiều user
    {
        return _dbContext.Users.ToListAsync();  //ToListAsync() truy vấn lấy tất cả user từ db
    }

}
