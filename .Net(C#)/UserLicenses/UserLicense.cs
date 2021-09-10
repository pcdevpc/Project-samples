using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class UserLicense
    {
        public int Id { get; set; }

        public string EntityType { get; set; }
        public int EntityId { get; set; }
        public int EntityTypeId { get; set; }
        public string License { get; set; }
        public int LicenseTypeId { get; set; }
        public string LicenseType { get; set; }
        public int UserId { get; set; }
        public bool IsVerified { get; set; }
        public int FileId { get; set; }
        public string FileUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }


    }
}
