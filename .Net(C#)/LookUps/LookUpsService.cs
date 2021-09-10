using Sabio.Data.Providers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain;
using System.Data;
using Sabio.Data;
using System.Dynamic;
using System.Text.RegularExpressions;

namespace Sabio.Services
{
    public class LookUpsService : ILookUpsService
    {
        IDataProvider _data = null;

        public LookUpsService(IDataProvider data)
        {
            _data = data;

        }

        public ExpandoObject GetTypes (string[] tableNames)
        {
            var result = new ExpandoObject();
           
            foreach (string table in tableNames)
            {
                switch (table)
                {
                    case "Languages":
                        result.TryAdd("languages", Get3Col(table));
                        break;

                    case "States":
                        result.TryAdd("states", Get3Col(table));
                        break;

                    default:
                        result.TryAdd(ToCamelCase(table), GetLookUp(table));
                        break;
                }
                    
            }
               
            return result;
        
        }


        public List<LookUp> GetLookUp(string tableName)
        {
            List<LookUp> list = null;

            string procName = $"dbo.{tableName}_SelectAll";

            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                LookUp aLookUp = MapLookUp(reader);

                if (list == null)
                {
                    list = new List<LookUp>();
                }

                list.Add(aLookUp);

            });

            return list;

        }


        public List<LookUp3Col> Get3Col(string tableName)
        {
            List<LookUp3Col> list = null;

            string procName = $"dbo.{tableName}_SelectAll";

            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                LookUp3Col lookUp3 = new LookUp3Col();

                int staringIndex = 0;

                lookUp3.Id = reader.GetSafeInt32(staringIndex++);
                lookUp3.Code = reader.GetSafeString(staringIndex++);
                lookUp3.Name = reader.GetSafeString(staringIndex++);

                if (list == null)
                {
                    list = new List<LookUp3Col>();
                }

                list.Add(lookUp3);

            });

            return list;

        }

       

        private static LookUp MapLookUp(IDataReader reader)
        {
            LookUp aLookUp = new LookUp();

            int staringIndex = 0;

            aLookUp.Id = reader.GetSafeInt32(staringIndex++);
            aLookUp.Name = reader.GetSafeString(staringIndex++);

            return aLookUp;

        }

        private static string ToCamelCase(string str)
        {
            string name = null;
            if (str.Length > 0)
            {
                str = Regex.Replace(str, "([A-Z])([A-Z]+)($|[A-Z])", m => m.Groups[1].Value + m.Groups[2].Value.ToLower() + m.Groups[3].Value);
                name = char.ToLower(str[0]) + str.Substring(1);
            }
            return name;
        }

    }
}
