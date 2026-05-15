using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharingService.DTOs;
using SharingService.Services;

namespace SharingService.Controllers
{
    [ApiController]
    [Route("api/sharing")]
    [Authorize]
    public class SharingController : ControllerBase
    {
        private readonly ISharingService _sharingService;

        public SharingController(ISharingService sharingService)
        {
            _sharingService = sharingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateShare([FromBody] CreateShareDto dto)
        {
            try
            {
                var share = await _sharingService.CreateShareAsync(dto);
                return Ok(share);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByToken(string token)
        {
            try
            {
                var share = await _sharingService.GetByTokenAsync(token);
                return Ok(share);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{token}")]
        public async Task<IActionResult> DeleteShare(string token)
        {
            try
            {
                await _sharingService.DeleteShareAsync(token);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}