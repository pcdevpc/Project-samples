using Sabio.Models.Domain;
using System.Collections.Generic;
using System.Dynamic;

namespace Sabio.Services
{
    public interface ILookUpsService
    {
        ExpandoObject GetTypes(string[] tableNames);
    }
}