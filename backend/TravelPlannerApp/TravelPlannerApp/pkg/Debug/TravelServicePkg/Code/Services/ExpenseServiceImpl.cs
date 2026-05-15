using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public class ExpenseServiceImpl : IExpenseService
    {
        private readonly AppDbContext _context;

        public ExpenseServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ExpenseDto>> GetAllAsync(int travelPlanId)
        {
            return await _context.Expenses
                .Where(e => e.TravelPlanId == travelPlanId)
                .Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    TravelPlanId = e.TravelPlanId,
                    Name = e.Name,
                    Category = e.Category,
                    Amount = e.Amount,
                    Date = e.Date,
                    Description = e.Description
                })
                .ToListAsync();
        }

        public async Task<BudgetSummaryDto> GetBudgetSummaryAsync(int travelPlanId)
        {
            var plan = await _context.TravelPlans.FindAsync(travelPlanId);

            if (plan == null)
                throw new Exception("Plan putovanja nije pronađen.");

            var totalSpent = await _context.Expenses
                .Where(e => e.TravelPlanId == travelPlanId)
                .SumAsync(e => e.Amount);

            return new BudgetSummaryDto
            {
                PlannedBudget = plan.Budget,
                TotalSpent = totalSpent,
                RemainingBudget = plan.Budget - totalSpent
            };
        }

        public async Task<ExpenseDto> CreateAsync(int travelPlanId, CreateExpenseDto dto)
        {
            if (dto.Amount < 0)
                throw new ArgumentException("Iznos troška ne može biti negativan.");

            var expense = new Expense
            {
                TravelPlanId = travelPlanId,
                Name = dto.Name,
                Category = dto.Category,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return new ExpenseDto
            {
                Id = expense.Id,
                TravelPlanId = expense.TravelPlanId,
                Name = expense.Name,
                Category = expense.Category,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description
            };
        }

        public async Task<ExpenseDto> UpdateAsync(int id, CreateExpenseDto dto)
        {
            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
                throw new Exception("Trošak nije pronađen.");

            if (dto.Amount < 0)
                throw new ArgumentException("Iznos troška ne može biti negativan.");

            expense.Name = dto.Name;
            expense.Category = dto.Category;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new ExpenseDto
            {
                Id = expense.Id,
                TravelPlanId = expense.TravelPlanId,
                Name = expense.Name,
                Category = expense.Category,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description
            };
        }

        public async Task DeleteAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
                throw new Exception("Trošak nije pronađen.");

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
}