

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs.Member;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectMembersController : Controller
    {
        private readonly ProjectMemberService _projectMemberService;

        public ProjectMembersController(ProjectMemberService projectMemberService)
        {
            _projectMemberService = projectMemberService;
        }

        // thêm người
        [HttpPost("{projectId}/members")]
        [Authorize]
        public async Task<IActionResult> projectMember(int projectId, [FromBody] ProjectMembersRequestDto request)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectMemberService.AddMemberAsync(projectId, userId, request);
            return StatusCode(response.StatusCode, response);
        }
    }
}
