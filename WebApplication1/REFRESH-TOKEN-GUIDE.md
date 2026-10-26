# Hướng dẫn triển khai Refresh Token

Tài liệu này hướng dẫn cách bổ sung refresh token cho dự án hiện tại. Đây là
hướng dẫn, không phải thay đổi mã nguồn đang chạy.

## Hiện trạng dự án

- Đăng nhập và phát access token nằm trong `Controllers/UserController.cs`.
- `Service/JwtService.cs` tạo JWT, thời hạn đọc từ `Jwt:DurationInMinutes`.
- `Program.cs` đã cấu hình xác thực JWT Bearer.
- `Models/User.cs` và `Data/ApplicationContext.cs` là nơi khai báo model và
  `DbSet` cho Entity Framework Core.
- Cấu hình hiện có `Jwt:RefreshTokenDays`, nhưng chưa có luồng phát hành, lưu,
  đổi hoặc thu hồi refresh token.
- Frontend gọi đăng nhập tại `FrontEnd/src/services/User.tsx`; hiện tại hàm
  đăng nhập chỉ trả về thông báo, chưa nhận/lưu access token hay gửi token khi
  gọi API.

## Luồng cần xây dựng

1. Khi đăng nhập thành công, backend phát access token ngắn hạn và refresh
   token ngẫu nhiên, khó đoán.
2. Backend lưu **bản băm** refresh token cùng người dùng, thời hạn và trạng
   thái thu hồi vào cơ sở dữ liệu. Không lưu refresh token dạng rõ.
3. Backend trả access token trong response; gửi refresh token qua cookie
   `HttpOnly`.
4. Khi access token hết hạn, frontend gọi endpoint làm mới bằng cookie. Backend
   xác minh refresh token, thu hồi token cũ, phát cặp token mới và đặt cookie
   mới.
5. Khi đăng xuất, backend thu hồi refresh token và xóa cookie.

Refresh token là thông tin xác thực tương đương mật khẩu trong thời gian nó
còn hiệu lực. Không ghi token ra log, không đưa token vào URL, và không lưu
refresh token trong `localStorage`.

## Bước 1: Tạo model lưu refresh token

Tạo model mới, ví dụ `Models/RefreshToken.cs`, có các trường:

```csharp
public class RefreshToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string TokenHash { get; set; } = "";
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? RevokedAtUtc { get; set; }
    public string? ReplacedByTokenHash { get; set; }
}
```

Thêm `DbSet<RefreshToken>` vào `ApplicationContext`. Có thể cấu hình quan hệ
`User`–`RefreshToken` một-nhiều bằng Fluent API hoặc navigation property.
Đặt unique index cho `TokenHash` và index cho `UserId`, rồi tạo migration:

```powershell
dotnet ef migrations add AddRefreshTokens
dotnet ef database update
```

Không đặt giá trị refresh token thật trong cột này; chỉ lưu SHA-256 hash.

## Bước 2: Tạo và băm token an toàn

Dùng bộ sinh số ngẫu nhiên mật mã để tạo tối thiểu 32 byte; mã hóa Base64Url
thành chuỗi token. Băm chuỗi token bằng SHA-256 trước khi lưu:

```csharp
var bytes = RandomNumberGenerator.GetBytes(32);
var token = WebEncoders.Base64UrlEncode(bytes);
var tokenHash = Convert.ToHexString(
    SHA256.HashData(Encoding.UTF8.GetBytes(token)));
```

Thêm các namespace cần thiết như
`System.Security.Cryptography`, `System.Text` và
`Microsoft.AspNetCore.WebUtilities`. Khi kiểm tra token nhận được, băm token
đó theo cùng cách rồi tìm bản ghi theo hash. Token ngẫu nhiên có entropy cao
nên không cần dùng thuật toán hash mật khẩu chậm như BCrypt.

## Bước 3: Cập nhật đăng nhập

Trong `UserController.Login`, sau khi xác minh mật khẩu:

- Tạo access token bằng `JwtService`.
- Chọn thời hạn access token ngắn, ví dụ 10–15 phút; cấu hình hiện tại là
  `Jwt:DurationInMinutes` và đang đặt 120 phút.
- Tạo refresh token, lưu hash và `ExpiresAtUtc` (dựa trên
  `Jwt:RefreshTokenDays`) vào database.
- Đặt refresh token vào cookie và trả access token trong response body.

Ví dụ thiết lập cookie:

```csharp
Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Lax,
    Expires = expiresAtUtc,
    Path = "/api/User"
});
```

`Secure = true` yêu cầu HTTPS. Chỉ dùng `Secure = false` trong môi trường
HTTP phát triển nếu thật sự cần; không dùng cấu hình đó khi triển khai.
`Path` nên bao phủ các endpoint refresh/logout. Cookie `HttpOnly` không thể
được JavaScript đọc.

## Bước 4: Tạo endpoint làm mới và xoay vòng token

Thêm endpoint công khai, ví dụ `POST /api/User/refresh`. Endpoint này cần:

1. Đọc cookie `refreshToken`; nếu thiếu thì trả `401 Unauthorized`.
2. Hash giá trị cookie và tìm bản ghi phù hợp.
3. Từ chối nếu không tồn tại, đã hết hạn, hoặc đã bị thu hồi.
4. Nếu token hợp lệ, thu hồi token cũ và tạo refresh token mới. Ghi bản ghi
   mới cùng hash và thời hạn trong một transaction để tránh trạng thái dở dang.
5. Đặt token mới vào cookie; trả access token mới trong response body.

Xoay vòng nghĩa là mỗi refresh token chỉ được dùng một lần. Nếu một token đã
bị thay thế lại xuất hiện, đó có thể là dấu hiệu token bị đánh cắp: thu hồi
các refresh token còn hiệu lực của người dùng (hoặc của phiên tương ứng) và
yêu cầu đăng nhập lại. Lưu `ReplacedByTokenHash` giúp liên kết token cũ với
token mới và xử lý trường hợp phát hiện phát lại.

Không gắn `[Authorize]` cho endpoint refresh: access token hết hạn chính là
lý do frontend cần gọi endpoint này. Tuy vậy, endpoint phải kiểm tra refresh
token độc lập như mô tả ở trên.

## Bước 5: Tạo endpoint đăng xuất

Thêm `POST /api/User/logout` để thu hồi refresh token đang gửi trong cookie,
ghi `RevokedAtUtc`, rồi xóa cookie bằng cùng tên, `Path`, `SameSite` và cấu
hình bảo mật đã dùng khi tạo cookie. Có thể yêu cầu access token hợp lệ cho
endpoint này nếu muốn chỉ cho người dùng đã đăng nhập đăng xuất; việc thu hồi
refresh token vẫn phải dựa trên token trong cookie.

## Bước 6: Cấu hình CORS và frontend

Frontend và backend hiện chạy khác origin (ví dụ cổng `5173` và `5024`).
Để trình duyệt gửi cookie:

- Backend CORS phải cho phép đúng origin frontend và bật credentials; không
  kết hợp `AllowCredentials()` với `AllowAnyOrigin()`.
- Request đăng nhập, refresh và logout từ frontend cần dùng
  `credentials: "include"`.
- Nếu frontend/backend được triển khai trên các site khác nhau, xem xét
  `SameSite=None` cùng `Secure=true`, HTTPS ở cả hai phía và biện pháp chống
  CSRF. Cookie tự động được trình duyệt gửi nên cần đánh giá CSRF, nhất là khi
  dùng `SameSite=None`.
- Lưu access token trong bộ nhớ ứng dụng và gửi
  `Authorization: Bearer <access-token>` khi gọi API cần đăng nhập. Tránh
  lưu access token dài hạn trong `localStorage`.
- Khi API trả `401` do access token hết hạn, gọi refresh một lần, cập nhật
  access token trong bộ nhớ rồi thử lại request ban đầu một lần. Nếu refresh
  thất bại, xóa trạng thái đăng nhập và yêu cầu đăng nhập lại; tránh vòng lặp
  refresh vô hạn.

Response đăng nhập/refresh có thể có dạng:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "<jwt>",
    "expiresIn": 900
  }
}
```

Refresh token không xuất hiện trong JSON vì được gửi bằng cookie `HttpOnly`.
Thống nhất tên `accessToken` (hoặc `token`) giữa backend và frontend.

## Bước 7: Kiểm thử luồng

Kiểm tra lần lượt bằng trình duyệt, Swagger/công cụ HTTP hỗ trợ cookie hoặc
kiểm thử tích hợp:

1. Đăng nhập đúng: nhận access token và cookie refresh token; database chỉ
   chứa hash token.
2. Gọi endpoint có `[Authorize]` với access token: thành công.
3. Gọi refresh: nhận access token mới và cookie mới; token cũ bị thu hồi.
4. Dùng lại cookie cũ: bị từ chối; xác nhận hành vi phát hiện phát lại.
5. Gọi refresh khi thiếu cookie, token không hợp lệ hoặc token hết hạn: nhận
   `401` và không phát token mới.
6. Đăng xuất: cookie bị xóa và refresh token bị thu hồi; gọi refresh tiếp
   theo phải thất bại.
7. Kiểm tra CORS/cookie trong trình duyệt và xác nhận frontend không lưu
   refresh token trong JavaScript storage hoặc log.

## Ghi chú triển khai

- Dùng UTC nhất quán (`DateTime.UtcNow`) cho thời điểm tạo, hết hạn và thu hồi.
- Chỉ chấp nhận HTTPS trong môi trường production; bảo vệ signing key bằng
  secret store/biến môi trường thay vì để secret thật trong cấu hình được
  commit.
- Có thể hỗ trợ nhiều phiên đăng nhập bằng cách lưu nhiều bản ghi refresh
  token trên một người dùng và thu hồi theo phiên hoặc theo người dùng.
- Xóa định kỳ các bản ghi đã hết hạn/thu hồi theo chính sách lưu trữ của dự án.
- Không dùng access token để thay thế refresh token; access token nên ngắn
  hạn, còn refresh token chỉ được gửi tới endpoint refresh/logout.
