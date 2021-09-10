import React from "react";
import * as userLicensesService from "../../../services/userLicenseService";
import * as lookupsService from "../../../services/lookUpsService";
import FileUploadDropzone from "../../files/FileUploadDropzone";
import { WrapperSimple } from "../../../layout-components";
import { Formik, Form } from "formik";
import toastr from "toastr";
import entityType from "../../../enums/entityType";
import PropTypes from "prop-types";

import {
  TextField,
  Button,
  // Box,
  Grid,
  // Checkbox,
  // InputLabel,
  // Select,
  MenuItem,
  Card,
  Divider,
  FormControl,
  // FormControlLabel,
} from "@material-ui/core";
import "./licenses.css";
import { formValidationSchema } from "./UserLicenseFormValidation";

import debug from "sabio-debug";

const _logger = debug.extend("UserLicensesForm");

class UserLicenseForm extends React.Component {
  state = {
    licenseTypes: [""],
    fileUrl: "",
    formData: {
      entityTypeId: entityType.kitchen,
      entityId: 123, // Id of kitchen
      license: "",
      licenseTypeId: "",
      isVerified: true,
      fileId: "",
    },
  };

  componentDidMount() {
    lookupsService
      .getLookUp(["insuranceTypes"])
      .then(this.onGetLicenseSuccess)
      .catch(function (response) {
        _logger(response);
      });

    const { state: locState } = this.props.location;
    if (!locState || locState.type !== "EDIT_LICENSE") {
      return;
    }
    let cardData = locState.currentCard;
    _logger(cardData);

    const license = {
      // dateCreated: cardData.dateCreated,
      // dateModified: cardData.dateModified,
      entityId: cardData.entityId,
      entityTypeId: cardData.entityTypeId,
      fileId: cardData.fileId,
      // id: cardData.id,
      isVerified: cardData.isVerified,
      license: cardData.license,
      licenseTypeId: cardData.licenseTypeId,
      // userId: cardData.userId,
    };

    const imgUrl = cardData.fileUrl;

    this.setState((prevState) => {
      let formData = { ...prevState.formdata };
      formData = license;
      let fileUrl = { ...prevState.fileUrl };
      fileUrl = imgUrl;
      return { formData, fileUrl };
    });
  }
  onGetLicenseSuccess = (data) => {
    _logger(data);
    this.setState(() => {
      let licenseTypes = { ...this.state.licenseTypes };
      licenseTypes = data.item.insuranceTypes;
      return { licenseTypes };
    });
  };
  mapLicenseType = (licenseTypes) => (
    <MenuItem key={`license_${licenseTypes.id}`} value={licenseTypes.id}>
      {licenseTypes.name}
    </MenuItem>
  );

  handleSubmit = (licenseData) => {
    _logger(licenseData);

    if (
      this.props.location.state !== undefined &&
      this.props.location.state.type === "EDIT_LICENSE"
    ) {
      licenseData.id = this.props.location.state.currentCard.id;
    }

    if (this.props.location.state === undefined) {
      userLicensesService
        .add(licenseData)
        .then(this.onAddSuccess)
        .catch(this.onAddError);
    } else {
      userLicensesService
        .updateById(licenseData)
        .then(this.onUpdateByIdSuccess)
        .catch(this.onUpdateError);
    }
  };

  onUpdateByIdSuccess = (response) => {
    _logger(response);
    toastr.success("License has been updated successfully.");
  };

  onUpdateError = (response) => {
    _logger(response);
    toastr.error("License update failed.", response);
  };
  onAddSuccess = (data) => {
    _logger(data);
    toastr.success("License has been added successfully.");

    userLicensesService
      .getById(data.item)
      .then(this.onGetByIdSuccess)
      .catch(function (response) {
        _logger(response);
      });
  };

  onGetByIdSuccess = (data) => {
    _logger(data);
    this.props.history.replace(
      `/kitchens/licenses/form?licenseId=${data.item.id}`,
      {
        type: "EDIT_LICENSE",
        currentCard: data.item,
      }
    );
  };

  onAddError = (data) => {
    _logger(data);
    toastr.error("License add failed.", data);
  };

  handleSuccess = (response) => {
    _logger(response);
    let item = response.data.items[0];
    toastr.success("Upload Success.");
    this.setState(() => {
      let formData = { ...this.state.formData };
      formData.fileId = item.id;
      let fileUrl = { ...this.state.fileUrl };
      fileUrl = item.url;
      return { fileUrl, formData };
    });
  };
  handleError = (response) => {
    _logger(response);
    toastr.error("Upload Error.");
  };

  onFormFieldChange = (e) => {
    let currentTarget = e.target;
    let newValue = currentTarget.value;
    let inputName = currentTarget.name;
    _logger(e);
    _logger(newValue, inputName);

    this.setState((prevState) => {
      let formData = { ...prevState.formData };
      formData[inputName] = newValue;
      return { formData };
    });
  };

  render() {
    return (
      <>
        <Grid item xs={12} lg={6}>
          <Card className="p-4 mb-4">
            <h1>Add/Edit License</h1>
            <Formik
              enableReinitialize={true}
              initialValues={this.state.formData}
              onSubmit={this.handleSubmit}
              validationSchema={formValidationSchema}
            >
              {({ values, touched, errors }) => (
                <Form>
                  <TextField
                    fullWidth
                    type="license"
                    label="License"
                    typeof="number"
                    value={values.license}
                    className="form-control"
                    name="license"
                    onChange={this.onFormFieldChange}
                    error={touched.license && Boolean(errors.license)}
                    helperText={touched.license && errors.license}
                  />
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="License Type"
                      name="licenseTypeId"
                      onChange={this.onFormFieldChange}
                      value={values.licenseTypeId}
                      error={
                        touched.licenseTypeId && Boolean(errors.licenseTypeId)
                      }
                      helperText={touched.licenseTypeId && errors.licenseTypeId}
                    >
                      {this.state.licenseTypes.map(this.mapLicenseType)}
                    </TextField>
                  </FormControl>
                  <WrapperSimple sectionHeading="License Picture Upload">
                    <FileUploadDropzone
                      isMultiple={false} //  'false' for a single file uploader or 'true' for multiple files
                      handleSuccess={this.handleSuccess}
                      handleError={this.handleError}
                    />{" "}
                    <div className="donor-image photo">
                      <label className="row">Image preview</label>
                      <img
                        className="img-fluid"
                        src={this.state.fileUrl}
                        id="preview-image"
                        alt=""
                      />
                    </div>
                  </WrapperSimple>

                  <Divider className="my-4" />
                  <Button
                    variant="contained"
                    className="mb-2"
                    size="small"
                    fullWidth
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Grid>
      </>
    );
  }
}

UserLicenseForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      type: PropTypes.string,
      currentCard: PropTypes.shape({
        id: PropTypes.number.isRequired,
        entityType: PropTypes.string.isRequired,
        license: PropTypes.string.isRequired,
        licenseType: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        isVerified: PropTypes.bool,
        fileId: PropTypes.number.isRequired,
        fileUrl: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired,
        dateModified: PropTypes.string.isRequired,
      }),
    }),
  }),
  history: PropTypes.shape({
    replace: PropTypes.func,
  }),
};

export default UserLicenseForm;
