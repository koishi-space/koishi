import React from "react";
import Spinner from "../../../../components/common/spinner/spinner";
import Input from "../../../../components/common/input/input";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import Button from "../../../../components/common/button/button";
import * as collectionsSerivice from "../../../../services/api/collectionsService";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./editCollectionPage.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
ReactModal.setAppElement("#root");

class EditCollectionPage extends React.Component {
  state = {
    model: null,
    data: null,
    loading: true,
    modalIsOpen: false,
    newRow: {},
  };

  componentDidMount() {
    collectionsSerivice
      .getCollectionModel(this.props.match.params.id)
      .then(({ data }) => {
        this.setState({ model: data });
        collectionsSerivice
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

  handleDeleteRow = async (index) => {
    await collectionsSerivice.deleteRow(this.props.match.params.id, index);
    toast.warn("Row deleted.")
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
                    {this.state.model.value.map((m) => (
                      <th>{m.columnName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.value.map((dt) => (
                    <tr>
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
                    collectionsSerivice
                      .addRowToCollection(this.props.match.params.id, rowToSubmit)
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
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default EditCollectionPage;
