using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.UserLicenses
{
    public class UserLicenseAddRequest
    {   
        [Required]
        [Range(1, int.MaxValue)]
        public int EntityTypeId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int EntityId { get; set; }
        [Required]
        [StringLength(225, MinimumLength = 2)]
        public string License { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int LicenseTypeId { get; set; }
        [Required]
        public bool IsVerified { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int FileId { get; set; }

    }
}
