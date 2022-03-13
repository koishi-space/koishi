import React from "react";
import Spinner from "../../../../components/common/spinner/spinner";
import Input from "../../../../components/common/input/input";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import Button from "../../../../components/common/button/button";
import Checkbox from "../../../../components/common/checkbox/checkbox";
import * as collectionsService from "../../../../services/api/collectionsService";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./editCollectionPage.css";
import ReactModal from "react-modal";
import TimePicker from "react-time-picker";
import { toast } from "react-toastify";
import moment from "moment";
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
    newRowError: [],
    editRowError: [],
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
    this.setState({ modalIsOpen: false, newRowError: [] });
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
    this.setState({ editModalIsOpen: false, editRow: {}, editRowError: [] });
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
                      <td>
                        <b>{this.state.data.value.indexOf(dt)}</b>
                      </td>
                      {dt.map((dc) => (
                        <td>{dc.data.toString()}</td>
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
                {this.state.model.value.map((field) => {
                  if (
                    field.dataType === "text" ||
                    field.dataType === "number" ||
                    field.dataType === "date"
                  )
                    return (
                      <Input
                        name={field.columnName}
                        labelText={field.columnName}
                        type={field.dataType}
                        value={this.state.newRow[field.columnName]}
                        onChange={(e) => {
                          let newRow = this.state.newRow;
                          newRow[field.columnName] = e.target.value;
                          this.setState({ newRow });
                        }}
                      />
                    );
                  if (field.dataType === "time")
                    return (
                      <div style={{ margin: "8px 0" }}>
                        <label
                          htmlFor={field.columnName}
                          style={{ marginRight: "4px" }}
                        >
                          {field.columnName}
                        </label>
                        <TimePicker
                          format="HH:mm"
                          name={field.columnName}
                          onChange={(e) => {
                            let newRow = this.state.newRow;
                            newRow[field.columnName] = e;
                            this.setState({ newRow });
                          }}
                          value={
                            this.state.newRow[field.columnName] ||
                            moment().format("HH:mm")
                          }
                        />
                      </div>
                    );
                  if (field.dataType === "bool")
                    return (
                      <Checkbox
                        labelText={field.columnName}
                        name={field.columnName}
                        noError
                        value={this.state.newRow[field.columnName] || false}
                        onChange={(e) => {
                          let newRow = this.state.newRow;
                          newRow[field.columnName] = e.target.checked;
                          this.setState({ newRow });
                        }}
                      />
                    );
                })}
                <Button
                  text="Add"
                  style={{ margin: "0 4px" }}
                  onClick={() => {
                    let rowToSubmit = new Array();
                    for (let [k, v] of Object.entries(this.state.newRow)) {
                      rowToSubmit.push({ column: k, data: v });
                    }
                    // Complete missing fields (left as default)
                    if (rowToSubmit.length !== this.state.model.value.length) {
                      for (const modelField of this.state.model.value) {
                        let correspondingValue = rowToSubmit.find(
                          (x) => x.column === modelField.columnName
                        );
                        if (!correspondingValue) {
                          if (modelField.dataType === "time")
                            rowToSubmit.push({
                              column: modelField.columnName,
                              data: moment().format("HH:mm"),
                            });
                          if (modelField.dataType === "bool")
                            rowToSubmit.push({
                              column: modelField.columnName,
                              data: "false",
                            });
                        }
                      }
                    }
                    collectionsService
                      .addRowToCollection(
                        this.props.match.params.id,
                        rowToSubmit
                      )
                      .then((data) => {
                        toast.success(data.data);
                        let newData = this.state.data;
                        newData.value.push(rowToSubmit);
                        this.setState({ data: newData, newRow: {} });
                        this.handleCloseModal();
                      })
                      .catch((ex) => {
                        if (ex.response.status === 400)
                          this.setState({ newRowError: ex.response.data });
                        else toast.error(ex.response.body);
                      });
                  }}
                />
                {this.state.newRowError &&
                  this.state.newRowError.map((x) => (
                    <p
                      style={{
                        color: "red",
                        marginTop: "3px",
                        marginBottom: "0",
                      }}
                    >
                      {x}
                    </p>
                  ))}
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
                {this.state.model.value.map((field) => {
                  if (
                    field.dataType === "text" ||
                    field.dataType === "number" ||
                    field.dataType === "date"
                  )
                    return (
                      <Input
                        name={field.columnName}
                        labelText={field.columnName}
                        type={field.dataType}
                        value={this.state.editRow[field.columnName]}
                        onChange={(e) => {
                          let editRow = this.state.editRow;
                          editRow[field.columnName] = e.target.value;
                          this.setState({ editRow });
                        }}
                      />
                    );
                  if (field.dataType === "time")
                    return (
                      <div style={{ margin: "8px 0" }}>
                        <label
                          htmlFor={field.columnName}
                          style={{ marginRight: "4px" }}
                        >
                          {field.columnName}
                        </label>
                        <TimePicker
                          format="HH:mm"
                          name={field.columnName}
                          onChange={(e) => {
                            let editRow = this.state.editRow;
                            editRow[field.columnName] = e;
                            this.setState({ editRow });
                          }}
                          value={
                            this.state.editRow[field.columnName] ||
                            moment().format("HH:mm")
                          }
                        />
                      </div>
                    );
                  if (field.dataType === "bool")
                    return (
                      <Checkbox
                        labelText={field.columnName}
                        name={field.columnName}
                        noError
                        value={this.state.editRow[field.columnName] || false}
                        onChange={(e) => {
                          let editRow = this.state.editRow;
                          editRow[field.columnName] = e.target.checked;
                          this.setState({ editRow });
                        }}
                      />
                    );
                })}
                {/* The old way of rendering inputs (does not support validation) */}
                {/* {this.state.model.value.map((field) => (
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
                ))} */}
                <Button
                  text="Save"
                  style={{ margin: "0 4px" }}
                  onClick={() => {
                    let rowToSubmit = new Array();
                    for (let [k, v] of Object.entries(this.state.editRow)) {
                      if (k !== "index")
                        rowToSubmit.push({ column: k, data: v });
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
                        this.handleCloseEditModal();
                      })
                      .catch((ex) => {
                        if (ex.response.status === 400)
                          this.setState({ editRowError: ex.response.data });
                        else toast.error(ex.response);
                      });
                  }}
                />
                {this.state.editRowError &&
                  this.state.editRowError.map((x) => (
                    <p
                      style={{
                        color: "red",
                        marginTop: "3px",
                        marginBottom: "0",
                      }}
                    >
                      {x}
                    </p>
                  ))}
              </ReactModal>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default EditCollectionPage;
