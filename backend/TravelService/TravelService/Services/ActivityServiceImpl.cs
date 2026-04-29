using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public class ActivityServiceImpl : IActivityService
    {
        private readonly AppDbContext _context;

        public ActivityServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ActivityDto>> GetAllAsync(int travelPlanId)
        {
            return await _context.Activities
                .Where(a => a.TravelPlanId == travelPlanId)
                .Select(a => new ActivityDto
                {
                    Id = a.Id,
                    TravelPlanId = a.TravelPlanId,
                    Name = a.Name,
                    Date = a.Date,
                    Time = a.Time,
                    Location = a.Location,
                    Description = a.Description,
                    EstimatedCost = a.EstimatedCost,
                    Status = a.Status
                })
                .ToListAsync();
        }

        public async Task<ActivityDto> CreateAsync(int travelPlanId, CreateActivityDto dto)
        {
            var activity = new Activity
            {
                TravelPlanId = travelPlanId,
                Name = dto.Name,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = dto.Status
            };

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return new ActivityDto
            {
                Id = activity.Id,
                TravelPlanId = activity.TravelPlanId,
                Name = activity.Name,
                Date = activity.Date,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status
            };
        }

        public async Task<ActivityDto> UpdateAsync(int id, CreateActivityDto dto)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
                throw new Exception("Aktivnost nije pronađena.");

            activity.Name = dto.Name;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = dto.Status;

            await _context.SaveChangesAsync();

            return new ActivityDto
            {
                Id = activity.Id,
                TravelPlanId = activity.TravelPlanId,
                Name = activity.Name,
                Date = activity.Date,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status
            };
        }

        public async Task DeleteAsync(int id)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
                throw new Exception("Aktivnost nije pronađena.");

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
        }
    }
}