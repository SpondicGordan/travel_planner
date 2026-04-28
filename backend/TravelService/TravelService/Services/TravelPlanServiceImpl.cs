using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public class TravelPlanServiceImpl : ITravelPlanService
    {
        private readonly AppDbContext _context;

        public TravelPlanServiceImpl(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<TravelPlanDto>> GetAllAsync(int userId)
        {
            return await _context.TravelPlans
                .Where(t => t.UserId == userId)
                .Select(t => new TravelPlanDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Budget = t.Budget,
                    Notes = t.Notes,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }
        public async Task<TravelPlanDto> GetByIdAsync(int id, int userId)
        {
            var plan = await _context.TravelPlans
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (plan == null)
                throw new Exception("Plan putovanja nije pronađen.");

            return new TravelPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                Notes = plan.Notes,
                CreatedAt = plan.CreatedAt
            };
        }
        public async Task<TravelPlanDto> CreateAsync(CreateTravelPlanDto dto, int userId)
        {
            if (dto.EndDate < dto.StartDate)
                throw new ArgumentException("Krajnji datum ne može biti prije početnog datuma.");

            if (dto.Budget < 0)
                throw new ArgumentException("Budžet ne može imati negativnu vrijednost.");

            var plan = new TravelPlan
            {
                UserId = userId,
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.TravelPlans.Add(plan);
            await _context.SaveChangesAsync();

            return new TravelPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                Notes = plan.Notes,
                CreatedAt = plan.CreatedAt
            };
        }

        public async Task<TravelPlanDto> UpdateAsync(int id, CreateTravelPlanDto dto, int userId)
        {
            var plan = await _context.TravelPlans
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (plan == null)
                throw new Exception("Plan putovanja nije pronađen.");

            if (dto.EndDate < dto.StartDate)
                throw new ArgumentException("Krajnji datum ne može biti prije početnog datuma.");

            if (dto.Budget < 0)
                throw new ArgumentException("Budžet ne može imati negativnu vrijednost.");

            plan.Name = dto.Name;
            plan.Description = dto.Description;
            plan.StartDate = dto.StartDate;
            plan.EndDate = dto.EndDate;
            plan.Budget = dto.Budget;
            plan.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return new TravelPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                Notes = plan.Notes,
                CreatedAt = plan.CreatedAt
            };
        }
        public async Task DeleteAsync(int id, int userId)
        {
            var plan = await _context.TravelPlans
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (plan == null)
                throw new Exception("Plan putovanja nije pronađen.");

            _context.TravelPlans.Remove(plan);
            await _context.SaveChangesAsync();
        }



    }
}