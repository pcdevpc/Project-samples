import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import "./licenses.css";

const _logger = debug.extend("SingleLicense");

function SingleLicense(props) {
  const oneLicense = props.licenseData;
  _logger(oneLicense);

  const onDeleteClick = function onDeleteClick() {
    props.onDeleteClick(oneLicense);
  };
  const onEditClick = function onEditClick() {
    props.onEditClick(oneLicense);
  };

  return (
    <div className="col card-temp">
      <div className="card" style={{ width: "18rem" }}>
        <div className="text-center">
          <img
            src={oneLicense.fileUrl}
            className="card-img-top  align-items-center"
            alt="..."
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">ID: {oneLicense.id}</h5>
          <p className="card-text">License Type: {oneLicense.licenseType}</p>
          <p className="card-text">License: {oneLicense.license}</p>
          <p className="card-text">User ID: {oneLicense.userId}</p>
          <p className="card-text">Date Modified: {oneLicense.dateModified}</p>
          <p className="card-text">
            Is verified?: {oneLicense.isVerified.toString()}
          </p>
        </div>
        <div className="card-footer">
          <button
            onClick={onEditClick}
            className="button mx-2 mt-2"
            size="medium"
            data-license-id={oneLicense.id}
          >
            Edit
          </button>
          <button
            onClick={onDeleteClick}
            className="button mx-2 mt-2"
            data-license-id={oneLicense.id}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

SingleLicense.propTypes = {
  licenseData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    entityType: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
    licenseType: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    isVerified: PropTypes.bool,
    fileId: PropTypes.number.isRequired,
    fileUrl: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }),
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};

export default React.memo(SingleLicense);
