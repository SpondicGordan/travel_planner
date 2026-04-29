using TravelService.DTOs;

namespace TravelService.Services
{
    public interface IDestinationService
    {
        Task<List<DestinationDto>> GetAllAsync(int travelPlanId);
        Task<DestinationDto> CreateAsync(int travelPlanId, CreateDestinationDto dto);
        Task<DestinationDto> UpdateAsync(int id, CreateDestinationDto dto);
        Task DeleteAsync(int id);
    }
}