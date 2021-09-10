import * as Yup from "yup";

const formValidationSchema = Yup.object().shape({
  entityTypeId: Yup.number().required("EnittyType is required"),
  entityId: Yup.number()
    .min(2, "Minimum 2 characters")
    .required("EntityId is required"),
  license: Yup.string()
    .min(2, "Minimum 2 characters")
    .max(225)
    .required("License is required"),
  licenseTypeId: Yup.number().required("LicenseType is required"),
  // isVerified: Yup.boolean()
  //   .required("Verification required")
  //   .oneOf([true], "Verification must be required"),
});

export { formValidationSchema };
