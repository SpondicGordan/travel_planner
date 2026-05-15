using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public interface ITravelPlanService
    {
        Task<List<TravelPlanDto>> GetAllAsync(int userId);
        Task<TravelPlanDto> GetByIdAsync(int id, int userId);
        Task<TravelPlanDto> CreateAsync(CreateTravelPlanDto dto, int userId);
        Task<TravelPlanDto> UpdateAsync(int id, CreateTravelPlanDto dto, int userId);
        Task DeleteAsync(int id, int userId);
    }
}