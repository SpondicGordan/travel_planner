using Microsoft.EntityFrameworkCore;
using SharingService.Data;
using SharingService.DTOs;
using SharingService.Models.DbModels;

namespace SharingService.Services
{
    public class SharingServiceImpl : ISharingService
    {
        private readonly SharingDbContext _context;

        public SharingServiceImpl(SharingDbContext context)
        {
            _context = context;
        }

        public async Task<SharedPlanDto> CreateShareAsync(CreateShareDto dto)
        {
            if (dto.AccessType != "VIEW" && dto.AccessType != "EDIT")
                throw new ArgumentException("Tip pristupa mora biti VIEW ili EDIT.");

            var token = Guid.NewGuid().ToString("N");

            var share = new SharedPlan
            {
                TravelPlanId = dto.TravelPlanId,
                Token = token,
                AccessType = dto.AccessType,
                CreatedAt = DateTime.UtcNow
            };

            _context.SharedPlans.Add(share);
            await _context.SaveChangesAsync();

            return new SharedPlanDto
            {
                Id = share.Id,
                TravelPlanId = share.TravelPlanId,
                Token = share.Token,
                AccessType = share.AccessType,
                CreatedAt = share.CreatedAt
            };
        }

        public async Task<SharedPlanDto> GetByTokenAsync(string token)
        {
            var share = await _context.SharedPlans
                .FirstOrDefaultAsync(s => s.Token == token);

            if (share == null)
                throw new Exception("Token nije validan.");

            return new SharedPlanDto
            {
                Id = share.Id,
                TravelPlanId = share.TravelPlanId,
                Token = share.Token,
                AccessType = share.AccessType,
                CreatedAt = share.CreatedAt
            };
        }

        public async Task DeleteShareAsync(string token)
        {
            var share = await _context.SharedPlans
                .FirstOrDefaultAsync(s => s.Token == token);

            if (share == null)
                throw new Exception("Token nije pronađen.");

            _context.SharedPlans.Remove(share);
            await _context.SaveChangesAsync();
        }
    }
}