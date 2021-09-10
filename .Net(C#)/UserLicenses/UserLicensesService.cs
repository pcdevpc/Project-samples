using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserLicenses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserLicensesService : IUserLicensesService
    {

        IDataProvider _data = null;

        public UserLicensesService(IDataProvider data)
        {
            _data = data;

        }

        public int Add(UserLicenseAddRequest model, int userId)
        {
            int id = 0;
        

            string procName = "[dbo].[UserLicenses_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                 
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                    col.AddWithValue("@UserId", userId);
                    AddCommonParams(model, col);
                    
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(UserLicenseUpdateRequest model, int userId)
        {
            string procName = "[dbo].[UserLicenses_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@UserId", userId);

                },
                returnParameters: null);
        }

        public Paged<UserLicense> GetPage(int pageIndex, int pageSize, string tableName)
        {
            

            Paged<UserLicense> pagedList = null;
            List<UserLicense> list = null;
            int totalCount = 0;

            string procName = $"dbo.UserLicenses_{tableName}";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
        

            },
            (reader, recordSetIndex)=>
            {
                UserLicense aUserLicense = MapUserLicense(reader, out int startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<UserLicense>();
                }

                list.Add(aUserLicense);

            });
            if (list != null)
            {
                pagedList = new Paged<UserLicense>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }



        public UserLicense Get(int id)
        {
            

            string procName = "[dbo].[UserLicenses_SelectById]";

            UserLicense userLicense = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
         

            }, delegate (IDataReader reader, short set)
            {
                userLicense = MapUserLicense(reader, out int startingIndex);

            });

            return userLicense;

        }
   

        public void Delete(int id)
        {
            string procName = "dbo.UserLicenses_DeleteById";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                });

        }
      
        private static UserLicense MapUserLicense(IDataReader reader, out int startingIndex)
        {
            UserLicense aUserLicense = new UserLicense();
        
            startingIndex = 0;
       

            aUserLicense.Id = reader.GetSafeInt32(startingIndex++);
            aUserLicense.EntityType = reader.GetSafeString(startingIndex++);
            aUserLicense.EntityId = reader.GetSafeInt32(startingIndex++);
            aUserLicense.EntityTypeId = reader.GetSafeInt32(startingIndex++);
            aUserLicense.License = reader.GetSafeString(startingIndex++);
            aUserLicense.LicenseTypeId = reader.GetSafeInt32(startingIndex++);
            aUserLicense.LicenseType = reader.GetSafeString(startingIndex++);
            aUserLicense.UserId = reader.GetSafeInt32(startingIndex++);
            aUserLicense.IsVerified = reader.GetSafeBool(startingIndex++);
            aUserLicense.FileId = reader.GetSafeInt32(startingIndex++);
            aUserLicense.FileUrl = reader.GetSafeString(startingIndex++);
            aUserLicense.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            aUserLicense.DateModified = reader.GetSafeUtcDateTime(startingIndex++);

            return aUserLicense;

        }
        private static void AddCommonParams(UserLicenseAddRequest model, SqlParameterCollection col)
        {

            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@License", model.License);
            col.AddWithValue("@LicenseTypeId", model.LicenseTypeId);
            col.AddWithValue("@IsVerified", model.IsVerified);
            col.AddWithValue("@FileId", model.FileId);

        }

    }
}
