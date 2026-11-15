using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Middleware.Example;
using WebApplication1.Data;
using WebApplication1.MiddleWare;
using WebApplication1.Repositories;
using WebApplication1.Service;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<PasswordService>();
//JWT
builder.Services.AddAuthentication(Options =>
{
    Options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    Options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    Options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(Options =>
{
    Options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProjectRepository>();
builder.Services.AddScoped<ProjectMemberRepository>();
builder.Services.AddScoped<ProjectMemberService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<StatusTaskRepository>();
builder.Services.AddScoped<StatusTaskService>();
builder.Services.AddScoped<TaskItemRepositories>();
builder.Services.AddScoped<TaskItemService>();
builder.Services.AddScoped<TaskAttachmentRepository>();
builder.Services.AddScoped<TaskAttachmentService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// core kết nối với react
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()  // Cho phép frontend gửi mọi loại HTTP Header lên backend.
            .AllowAnyMethod()  // Cho phép frontend sử dụng tất cả HTTP Method.
            .AllowCredentials();// Cho phép frontend gửi thông tin xác thực (credentials) kèm theo request
        }
    );
}
);
//mdw
builder.Services.AddHttpContextAccessor();
// kết nối với database
builder.Services.AddDbContext<ApplicationContext>(
    Options => Options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();
app.UseMiddleware<RequestCultureMiddleware>();// đầu tiên, để bắt lỗi của mọi thứ phía sau
//kết nối FE BE
app.UseCors("AllowReactApp");
app.UseAuthentication(); // VD kiểm tra khách
app.UseMiddleware<CurrentUserMiddleware>(); // // sau UseAuthentication, VD CurrentUserMiddleware giống Bảo vệ ghi tên vào sổ
app.UseAuthorization();
app.MapControllers();
app.Run();
