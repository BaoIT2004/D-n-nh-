using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Service;
using Middleware.Example;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<PasswordService>();

// core kết nối với react
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        }
    );
}
);

// kết nối với database
builder.Services.AddDbContext<ApplicationContext>(
    Options => Options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// xây dựng middleware
app.UseMiddleware<RequestCultureMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

    //kết nối FE BE
app.UseCors("AllowReactApp");
app.MapControllers();
app.Run();
