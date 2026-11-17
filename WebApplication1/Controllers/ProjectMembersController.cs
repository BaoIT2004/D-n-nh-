

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

        //Hiển thị các thành viên đươc mời và chủ dự án
        [HttpGet("view/{projectId}")]
        [Authorize]
        public async Task<IActionResult> GetMember(int projectId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _projectMemberService.GetMemberAsync(projectId, userId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
