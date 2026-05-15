using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models.DbModels;

namespace TravelService.Services
{
    public class DestinationServiceImpl : IDestinationService
    {
        private readonly AppDbContext _context;

        public DestinationServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DestinationDto>> GetAllAsync(int travelPlanId)
        {
            return await _context.Destinations
                .Where(d => d.TravelPlanId == travelPlanId)
                .Select(d => new DestinationDto
                {
                    Id = d.Id,
                    TravelPlanId = d.TravelPlanId,
                    Name = d.Name,
                    Location = d.Location,
                    ArrivalDate = d.ArrivalDate,
                    DepartureDate = d.DepartureDate,
                    Description = d.Description
                })
                .ToListAsync();
        }

        public async Task<DestinationDto> CreateAsync(int travelPlanId, CreateDestinationDto dto)
        {
            var destination = new Destination
            {
                TravelPlanId = travelPlanId,
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description
            };

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return new DestinationDto
            {
                Id = destination.Id,
                TravelPlanId = destination.TravelPlanId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description
            };
        }

        public async Task<DestinationDto> UpdateAsync(int id, CreateDestinationDto dto)
        {
            var destination = await _context.Destinations.FindAsync(id);

            if (destination == null)
                throw new Exception("Destinacija nije pronađena.");

            destination.Name = dto.Name;
            destination.Location = dto.Location;
            destination.ArrivalDate = dto.ArrivalDate;
            destination.DepartureDate = dto.DepartureDate;
            destination.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new DestinationDto
            {
                Id = destination.Id,
                TravelPlanId = destination.TravelPlanId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description
            };
        }
        public async Task DeleteAsync(int id)
        {
            var destination = await _context.Destinations.FindAsync(id);

            if (destination == null)
                throw new Exception("Destinacija nije pronađena.");

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
        }
    }
}