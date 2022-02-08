import React from "react";
import Spinner from "../../../../components/common/spinner/spinner";
import Input from "../../../../components/common/input/input";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import Button from "../../../../components/common/button/button";
import * as collectionsService from "../../../../services/api/collectionsService";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./editCollectionPage.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
ReactModal.setAppElement("#root");

class EditCollectionPage extends React.Component {
  state = {
    model: null,
    data: null,
    loading: true,
    editModalIsOpen: false,
    modalIsOpen: false,
    newRow: {},
    editRow: {},
  };

  componentDidMount() {
    collectionsService
      .getCollectionModel(this.props.match.params.id)
      .then(({ data }) => {
        this.setState({ model: data });
        collectionsService
          .getCollectionData(this.props.match.params.id)
          .then(({ data }) => {
            this.setState({ data, loading: false });
          });
      });
  }

  handleOpenModal = () => {
    this.setState({ modalIsOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };

  handleOpenEditModal = (dt) => {
    let field = {};
    for (let m of this.state.model.value) field[m.columnName] = null;
    for (let i of dt) {
      field[i.column] = i.data;
    }
    field.index = this.state.data.value.indexOf(dt);
    this.setState({ editModalIsOpen: true, editRow: field });
  };

  handleCloseEditModal = () => {
    this.setState({ editModalIsOpen: false, editRow: {} });
  };

  handleDeleteRow = async (index) => {
    await collectionsService.deleteRow(this.props.match.params.id, index);
    toast.warn("Row deleted.");
    let data = this.state.data;
    data.value.splice(index, 1);
    this.setState({ data });
  };

  render() {
    return (
      <div className="view-small-border collection-edit">
        <WorkspaceNav collectionId={this.props.match.params.id} />
        <div className="collection-edit-table-div">
          {this.state.loading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {this.state.model.value.map((m) => (
                      <th>{m.columnName}</th>
                    ))}
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.value.map((dt) => (
                    <tr key={dt[0]._id}>
                      <td><b>{this.state.data.value.indexOf(dt)}</b></td>
                      {dt.map((dc) => (
                        <td>{dc.data}</td>
                      ))}
                      <td>
                        <DeleteOutlineOutlinedIcon
                          className="edit-collection-delete-icon"
                          onClick={async () =>
                            this.handleDeleteRow(
                              this.state.data.value.indexOf(dt)
                            )
                          }
                        />
                      </td>
                      <td>
                        <EditOutlinedIcon
                          className="edit-collection-edit-icon"
                          onClick={async () => this.handleOpenEditModal(dt)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactModal
                isOpen={this.state.modalIsOpen}
                className="edit-collection-page-modal"
                overlayClassName="edit-collection-page-modal-overlay"
                onRequestClose={this.handleCloseModal}
                shouldCloseOnOverlayClick={true}
              >
                <h1>New row</h1>
                {this.state.model.value.map((field) => (
                  <Input
                    name={field.columnName}
                    placeholder={field.columnName}
                    type={field.dataType}
                    value={this.state.newRow[field.columnName]}
                    onChange={(e) => {
                      let newRow = this.state.newRow;
                      newRow[field.columnName] = e.target.value;
                      this.setState({ newRow });
                    }}
                  />
                ))}
                <Button
                  text="Add"
                  style={{ margin: "0 4px" }}
                  onClick={() => {
                    let rowToSubmit = new Array();
                    for (let [k, v] of Object.entries(this.state.newRow)) {
                      rowToSubmit.push({ column: k, data: v });
                    }
                    collectionsService
                      .addRowToCollection(
                        this.props.match.params.id,
                        rowToSubmit
                      )
                      .then(({ data }) => {
                        toast.success(data);
                        let newData = this.state.data;
                        newData.value.push(rowToSubmit);
                        this.setState({ data: newData, newRow: {} });
                      })
                      .catch((ex) => {
                        if (ex.response) toast.error(ex.response);
                      })
                      .then(() => this.handleCloseModal());
                  }}
                />
              </ReactModal>
              <Button text="+" outline onClick={() => this.handleOpenModal()} />

              <ReactModal
                isOpen={this.state.editModalIsOpen}
                className="edit-collection-page-modal"
                overlayClassName="edit-collection-page-modal-overlay"
                onRequestClose={this.handleCloseEditModal}
                shouldCloseOnOverlayClick={true}
              >
                <h1>Edit row</h1>
                {this.state.model.value.map((field) => (
                  <Input
                    name={field.columnName}
                    placeholder={field.columnName}
                    type={field.dataType}
                    value={this.state.editRow[field.columnName]}
                    onChange={(e) => {
                      let editRow = this.state.editRow;
                      editRow[field.columnName] = e.target.value;
                      this.setState({ editRow });
                    }}
                  />
                ))}
                <Button
                  text="Save"
                  style={{ margin: "0 4px" }}
                  onClick={() => {
                    let rowToSubmit = new Array();
                    for (let [k, v] of Object.entries(this.state.editRow)) {
                      if (k !== "index") rowToSubmit.push({ column: k, data: v });
                    }
                    collectionsService
                      .editRow(
                        this.props.match.params.id,
                        this.state.editRow.index,
                        rowToSubmit
                      )
                      .then(({ data }) => {
                        toast.success(data);
                        let newData = this.state.data;
                        newData.value[this.state.editRow.index] = rowToSubmit;
                        this.setState({ data: newData, editRow: {} });
                      })
                      .catch((ex) => {
                        if (ex.response) toast.error(ex.response);
                      })
                      .finally(() => this.handleCloseEditModal());
                  }}
                />
              </ReactModal>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default EditCollectionPage;
