

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectMembersController : Controller
    {
        private readonly ApplicationContext _dbContext;
        private readonly ProjectMemberService _projectMemberService;

        public ProjectMembersController(ApplicationContext dbContext, ProjectMemberService projectMemberService)
        {
            _dbContext = dbContext;
            _projectMemberService = projectMemberService;
        }

        // thêm người 
        [HttpPost("{projectId}/members")]
        [Authorize]
        public async Task<IActionResult> projectMember (int projectId, [FromBody] ProjectMembersRequestDto request)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectMemberService.AddMemberAsync(projectId, userId, request);
            return StatusCode(response.StatusCode, response);
        }
    }
}