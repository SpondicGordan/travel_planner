namespace SharingService.DTOs
{
    public class SharedPlanDto
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string AccessType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateShareDto
    {
        public int TravelPlanId { get; set; }
        public string AccessType { get; set; } = "VIEW";
    }
}