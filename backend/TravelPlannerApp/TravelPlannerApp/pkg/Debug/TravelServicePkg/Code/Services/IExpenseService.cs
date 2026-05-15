using TravelService.DTOs;

namespace TravelService.Services
{
    public interface IExpenseService
    {
        Task<List<ExpenseDto>> GetAllAsync(int travelPlanId);
        Task<BudgetSummaryDto> GetBudgetSummaryAsync(int travelPlanId);
        Task<ExpenseDto> CreateAsync(int travelPlanId, CreateExpenseDto dto);
        Task<ExpenseDto> UpdateAsync(int id, CreateExpenseDto dto);
        Task DeleteAsync(int id);
    }
}