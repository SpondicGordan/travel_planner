using TravelService.DTOs;

namespace TravelService.Services
{
    public interface IActivityService
    {
        Task<List<ActivityDto>> GetAllAsync(int travelPlanId);
        Task<ActivityDto> CreateAsync(int travelPlanId, CreateActivityDto dto);
        Task<ActivityDto> UpdateAsync(int id, CreateActivityDto dto);
        Task DeleteAsync(int id);
    }
}