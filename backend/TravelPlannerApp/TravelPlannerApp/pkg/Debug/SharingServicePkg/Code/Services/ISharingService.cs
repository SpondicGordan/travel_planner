using SharingService.DTOs;

namespace SharingService.Services
{
    public interface ISharingService
    {
        Task<SharedPlanDto> CreateShareAsync(CreateShareDto dto);
        Task<SharedPlanDto> GetByTokenAsync(string token);
        Task DeleteShareAsync(string token);
    }
}