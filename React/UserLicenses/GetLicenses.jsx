import React from "react";
import * as userLicensesService from "../../../services/userLicenseService";
import debug from "sabio-debug";
import SingleLicense from "./SingleLicense";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./licenses.css";
import { MenuItem, Select } from "@material-ui/core";

const _logger = debug.extend("GetLicense");

class GetLicenses extends React.Component {
  state = {
    current: 1,
    pageSize: 6,
    total: 0,
    table: "SelectByIsVerfied_False",
    sortBy: [
      {
        id: 1,
        value: "SelectAll_OrderByDateModified_Desc",
        name: "Date Modified (Descending)",
      },
      {
        id: 2,
        value: "SelectAll_OrderByDateModified_Asc",
        name: "Date Modified (Ascending)",
      },
      {
        id: 3,
        value: "SelectByIsVerfied_False",
        name: "Not Verified",
      },
    ],
  };

  componentDidMount() {
    userLicensesService
      .getAll(this.state.current - 1, this.state.pageSize, this.state.table)
      .then(this.ongetAllSuccess)
      .catch(this.ongetAllError);
  }
  ongetAllSuccess = (licenses) => {
    let licensesData = licenses.item.pagedItems;
    _logger(licensesData);

    this.setState(() => {
      return {
        total: licenses.item.totalCount,
        mappedLicenses: licensesData.map(this.mapLicense),
      };
    });
  };

  ongetAllError(response) {
    _logger({ GetallError: response });
  }

  mapLicense = (oneLicense) => {
    return (
      <SingleLicense
        key={`Licenses-${oneLicense.id}`}
        licenseData={oneLicense}
        onDeleteClick={this.onDeleteClick}
        onEditClick={this.onEditClick}
      ></SingleLicense>
    );
  };
  onDeleteClick = (e) => {
    _logger(e);
    userLicensesService
      .deleteLicense(e.id)
      .then(this.onDeleteSuccess)
      .catch(function (response) {
        _logger({ deleteError: response });
      });
  };
  onDeleteSuccess = (response) => {
    _logger(response);

    userLicensesService
      .getAll(this.state.current - 1, this.state.pageSize, this.state.table)
      .then(this.ongetAllSuccess)
      .catch(this.ongetAllError);
  };
  onEditClick = (press) => {
    _logger(press);

    this.props.history.push(`/kitchens/licenses/form?licenseId=${press.id}`, {
      type: "EDIT_LICENSE",
      currentCard: press,
    });
  };

  onPageChange = (page) => {
    this.setState({ current: page }, () => {
      userLicensesService
        .getAll(page - 1, this.state.pageSize, this.state.table)
        .then(this.ongetAllSuccess)
        .catch(this.ongetAllError);
    });
  };

  mapSortBy = (sortBy) => (
    <MenuItem key={`sortBy_${sortBy.id}`} value={sortBy.value}>
      {sortBy.name}
    </MenuItem>
  );
  onSortByChange = (e) => {
    _logger(e.target.value);
    let tableName = e.target.value;
    this.setState({ table: tableName });

    userLicensesService
      .getAll(this.state.current - 1, this.state.pageSize, tableName)
      .then(this.ongetAllSuccess)
      .catch(this.ongetAllError);
  };

  render() {
    return (
      <>
        <div className="inline">
          {`Sort By: `}
          <Select
            onChange={this.onSortByChange}
            value={this.state.table}
            // key={`table_${this.state.table}`}
          >
            {this.state.sortBy.map(this.mapSortBy)}
          </Select>
        </div>

        <div className="row grid-container">{this.state.mappedLicenses}</div>

        <Pagination
          pageSize={this.state.pageSize}
          onChange={this.onPageChange}
          current={this.state.current}
          total={this.state.total}
        />
      </>
    );
  }
}

GetLicenses.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default GetLicenses;
