using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public class ChecklistServiceImpl : IChecklistService
    {
        private readonly AppDbContext _context;

        public ChecklistServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChecklistItemDto>> GetAllAsync(int travelPlanId)
        {
            return await _context.ChecklistItems
                .Where(c => c.TravelPlanId == travelPlanId)
                .Select(c => new ChecklistItemDto
                {
                    Id = c.Id,
                    TravelPlanId = c.TravelPlanId,
                    Text = c.Text,
                    IsCompleted = c.IsCompleted
                })
                .ToListAsync();
        }

        public async Task<ChecklistItemDto> CreateAsync(int travelPlanId, CreateChecklistItemDto dto)
        {
            var item = new ChecklistItem
            {
                TravelPlanId = travelPlanId,
                Text = dto.Text,
                IsCompleted = false
            };

            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();

            return new ChecklistItemDto
            {
                Id = item.Id,
                TravelPlanId = item.TravelPlanId,
                Text = item.Text,
                IsCompleted = item.IsCompleted
            };
        }

        public async Task<ChecklistItemDto> ToggleAsync(int id, ToggleChecklistItemDto dto)
        {
            var item = await _context.ChecklistItems.FindAsync(id);

            if (item == null)
                throw new Exception("Stavka nije pronađena.");

            item.IsCompleted = dto.IsCompleted;
            await _context.SaveChangesAsync();

            return new ChecklistItemDto
            {
                Id = item.Id,
                TravelPlanId = item.TravelPlanId,
                Text = item.Text,
                IsCompleted = item.IsCompleted
            };
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);

            if (item == null)
                throw new Exception("Stavka nije pronađena.");

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}