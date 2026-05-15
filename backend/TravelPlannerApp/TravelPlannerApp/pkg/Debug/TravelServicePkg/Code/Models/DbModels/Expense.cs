namespace TravelService.Models.DbModels
{
    public class Expense
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "OTHER";
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;

        public TravelPlan TravelPlan { get; set; } = null!;
    }
}