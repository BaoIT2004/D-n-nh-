using WebApplication1.DTOs.ApiResponse;
using WebApplication1.DTOs.Auth;
using WebApplication1.Repositories;

namespace WebApplication1.Service;

public class UserService
{
    private readonly UserRepository _userRepository;
    private readonly PasswordService _passwordService;
    private readonly JwtService _jwtService;

    public UserService(
        UserRepository userRepository,
        PasswordService passwordService,
        JwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public async Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request)
    {
        // 1. Validate dữ liệu đầu vào
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email không được để trống");
        }
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors.Add("Mật khẩu không được để trống");
        }

        if (errors.Count > 0)
        {
            return new ApiResponse<LoginResponseDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Status = false,
                Message = "Dữ liệu đăng nhập không hợp lệ",
                Data = null!,
                Errors = errors
            };
        }

        // 2. Tìm user theo email thông qua Repository
        var user = await _userRepository.GetByEmailAsync(request.Email);

        // 3. Kiểm tra sự tồn tại của user và xác thực mật khẩu
        if (user == null || !_passwordService.VerifyPassword(request.Password, user.passWord))
        {
            return new ApiResponse<LoginResponseDto>
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Status = false,
                Message = "Email hoặc mật khẩu không đúng",
                Data = null!,
                Errors = new List<string> { "Email hoặc mật khẩu không đúng" }
            };
        }

        // 4. Tạo cặp AccessToken & RefreshToken
        var token = await _jwtService.GenerateToken(user);

        // 5. Map sang LoginResponseDto trả về cho Controller
        return new ApiResponse<LoginResponseDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Status = true,
            Message = "Đăng nhập thành công",
            Data = new LoginResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                AccessToken = token.AccessToken,
                RefreshToken = token.RefreshToken
            }
        };
    }
}
