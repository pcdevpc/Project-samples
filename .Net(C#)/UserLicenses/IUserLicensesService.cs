using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserLicenses;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IUserLicensesService
    {
        int Add(UserLicenseAddRequest model, int userId);
        void Delete(int id);
        Paged<UserLicense> GetPage(int pageIndex, int pageSize, string tableName);
        UserLicense Get(int id);
        void Update(UserLicenseUpdateRequest model, int userId);
    }
}