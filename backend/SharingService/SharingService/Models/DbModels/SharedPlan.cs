namespace SharingService.Models.DbModels
{
    public class SharedPlan
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string AccessType { get; set; } = "VIEW";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}