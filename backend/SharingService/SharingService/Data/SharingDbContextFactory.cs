using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SharingService.Data
{
    public class SharingDbContextFactory : IDesignTimeDbContextFactory<SharingDbContext>
    {
        public SharingDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SharingDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=TravelPlannerDb;Trusted_Connection=True;TrustServerCertificate=True;");

            return new SharingDbContext(optionsBuilder.Options);
        }
    }
}