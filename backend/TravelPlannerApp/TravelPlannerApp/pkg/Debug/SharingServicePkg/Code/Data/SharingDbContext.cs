using Microsoft.EntityFrameworkCore;
using SharingService.Models.DbModels;

namespace SharingService.Data
{
    public class SharingDbContext : DbContext
    {
        public SharingDbContext(DbContextOptions<SharingDbContext> options) : base(options) { }

        public DbSet<SharedPlan> SharedPlans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SharedPlan>()
                .HasIndex(s => s.Token)
                .IsUnique();
        }
    }
}