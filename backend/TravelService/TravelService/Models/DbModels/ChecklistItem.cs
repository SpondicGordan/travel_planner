namespace TravelService.Models.DbModels
{
    public class ChecklistItem
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;

        public TravelPlan TravelPlan { get; set; } = null!;
    }
}