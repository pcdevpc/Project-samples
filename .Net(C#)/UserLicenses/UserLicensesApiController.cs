using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserLicenses;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/UserLicenses")]
    [ApiController]
    public class UserLicensesApiController : BaseApiController
    {
        private IUserLicensesService _service = null;
        private IAuthenticationService<int> _authService = null;

        public UserLicensesApiController(IUserLicensesService service
            , ILogger<UserLicensesApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
            {
                _service = service;
                _authService = authService;
            }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(UserLicenseAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int UserId = _authService.GetCurrentUserId();
                int id = _service.Add(model, UserId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);

            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(UserLicenseUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;//

            try
            {
                int UserId = _authService.GetCurrentUserId();
                _service.Update(model, UserId);
              
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<UserLicense>>> GetPage(int pageIndex, int pageSize, string tableName)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<UserLicense> page = _service.GetPage(pageIndex, pageSize, tableName);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<UserLicense>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<UserLicense>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                UserLicense userLicense = _service.Get(id);

                if (userLicense == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<UserLicense> { Item = userLicense };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }




    }
}
