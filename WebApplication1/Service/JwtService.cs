using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Models;
using WebApplication1.Repositories;

public class JwtService
{

    // khai báo lớn jwt
    private readonly IConfiguration _config; //IConfiguration: cho phép đọc cấu hình từ appsettings.json.
    private readonly UserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;


    public JwtService(IConfiguration config ,UserRepository userRepository,IRefreshTokenRepository refreshTokenRepository) //hàm khởi tạo, nhận cấu hình từ ASP.NET Core thông qua Dependency Injection.
    {
        _config = config;
        _refreshTokenRepository = refreshTokenRepository;
        _userRepository = userRepository;
    }

    public async Task<refreshToken?> ValidateToken(string Token)
    {
        var refreshTokenHash = HashRefreshToken(Token);
        var refreshToken = await _refreshTokenRepository.Get(refreshTokenHash);
        if(refreshToken is null || refreshToken.Expiry < DateTime.UtcNow){
            return null;
        }

        await _refreshTokenRepository.Delete(refreshToken);

        var user = await _userRepository.Get(refreshToken.UserId);
        if(user is null) return null;

        return await GenerateToken(user);

    }

    public async Task<refreshToken> GenerateToken(User user)
    {
        //1. Tạo thông tin người dùng
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) // ClaimTypes.NameIdentifier stores the user's ID.
        };

        //2. Tạo chìa khóa
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:key"]!)); // tạo chòa khóa/ chuyễn ký tự thành mã UTF8 _config["Jwt:key"]:Dùng để lấy giá trị Key trong file appsettings.json.
        //3. Tạo chữ ký
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); // tạo chữ ký / SecurityAlgorithms.HmacSha256: thuật toán dùng để ký Token. / SigningCredentials: kết hợp khóa và thuật toán để tạo thông tin ký.
        //4. Tạo JWT
        var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"], //Đơn vị phát hành Token.
          audience: _config["Jwt:Audience"],//Đối tượng được phép nhận hoặc sử dụng Token.
          claims: claims,  //Thông tin người dùng được nhúng vào Token.
          expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:DurationInMinutes"])), //Thời điểm Token hết hạn.
          signingCredentials: creds //Thông tin dùng để ký Token.

        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);  // chuyển đổi đối tượng JwtSecurityToken thành chuỗi JWT để gửi về cho Client.
        
        
        return new refreshToken
        {
            Tokens = accessToken,
            UserId = user.Id,
            Expiry = DateTime.UtcNow.AddDays(_config.GetValue<int>("Jwt:RefreshTokenDays")),
            RefreshToken = await GenerateRefreshToken(user.Id)
        };

        //1 jwt có dạng xxxxx.yyyyy.zzzzz
        // Ba phần đó lần lượt là:
        // - Header: thông tin loại Token và thuật toán ký.
        // - Payload: Claims và thời gian hết hạn.
        // - Signature: chữ ký dùng để xác minh Token.
    }

    private async Task<string> GenerateRefreshToken(int userId)
    {
        var refreshTokenValidityDays = _config.GetValue<int>("Jwt:RefreshTokenDays");
        var tokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var refreshToken = new refreshToken
        {
            Tokens = HashRefreshToken(tokenValue),
            Expiry = DateTime.UtcNow.AddDays(refreshTokenValidityDays),
            UserId = userId
        };

        await _refreshTokenRepository.Create(refreshToken);
        return tokenValue;
    }

    private static string HashRefreshToken(string token)
    {
        return Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }

    // Logout

    public async Task<bool> logoutRefreshtoken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }
        // Database đang lưu hash, nên phải hash token nhận được trước khi tìm.
        var tokenHash = HashRefreshToken(token);
        var storedToken = await _refreshTokenRepository.Get(tokenHash);

        if(storedToken is null)
        {
            return false;
        }

        await _refreshTokenRepository.Delete(storedToken);
        return true;
    }
}