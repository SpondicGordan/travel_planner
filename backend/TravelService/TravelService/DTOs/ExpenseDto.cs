namespace TravelService.DTOs
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class CreateExpenseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "OTHER";
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class BudgetSummaryDto
    {
        public decimal PlannedBudget { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal RemainingBudget { get; set; }
    }
}