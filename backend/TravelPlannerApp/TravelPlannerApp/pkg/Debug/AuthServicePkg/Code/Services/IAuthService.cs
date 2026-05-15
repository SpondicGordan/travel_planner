using AuthService.DTOs;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<UserDto> RegisterAsync(RegisterDto dto);
        Task<string> LoginAsync(LoginDto dto);
        Task<List<UserDto>> GetAllUsersAsync();
        Task DeleteUserAsync(int id);
    }
}