using TravelService.DTOs;

namespace TravelService.Services
{
    public interface IChecklistService
    {
        Task<List<ChecklistItemDto>> GetAllAsync(int travelPlanId);
        Task<ChecklistItemDto> CreateAsync(int travelPlanId, CreateChecklistItemDto dto);
        Task<ChecklistItemDto> ToggleAsync(int id, ToggleChecklistItemDto dto);
        Task DeleteAsync(int id);
    }
}