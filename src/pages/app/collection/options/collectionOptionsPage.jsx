import React from "react";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import Button from "../../../../components/common/button/button";
import Spinner from "../../../../components/common/spinner/spinner";
import Input from "../../../../components/common/input/input";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactModal from "react-modal";
import _ from "lodash";
import {
  getCollectionNoPopulate,
  deleteCollection,
  editCollection,
  resetCollectionSettings,
  getCollectionSettings,
  renameCollectionSettings,
  deleteCollectionSettings,
} from "../../../../services/api/collectionsService";
import {
  exportCollectionAsJSON,
  shareCollection,
  removeCollectionShare,
  changeCollectionVisibility,
} from "../../../../services/api/toolsService";
import ConfirmDialog from "../../../../components/confirmDialog/confirmDialog";
import "./collectionOptionsPage.css";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import download from "downloadjs";
import Checkbox from "../../../../components/common/checkbox/checkbox";

// TODO: implement ViewCollectionPage
class CollectionOptionsPage extends React.Component {
  state = {
    loading: true,
    collection: {},
    redirect: undefined,
    titleEditActive: false,
    editFieldsValues: {},
    shareModalIsOpen: false,
    shareInputEmail: "",
    shareInputAllowEditing: false,
    shareModalLoading: false,
  };

  componentDidMount() {
    getCollectionNoPopulate(this.props.match.params.id).then(({ data }) => {
      let collection = data;
      getCollectionSettings(data._id).then(({ data: settings }) => {
        collection.settings = settings;
        let editFieldsValues = {};
        for (const s of settings) editFieldsValues[s._id] = s.name;
        this.setState({ collection, editFieldsValues, loading: false });
      });
    });
  }

  handleDeleteCollection = () => {
    deleteCollection(this.props.match.params.id).then(({ data }) =>
      ConfirmDialog({
        title: "Delete collection",
        message: `Are you sure you want to delete ${this.state.collection.title}?`,
        labelConfirm: "Delete",
        labelDismiss: "Cancel",
        onConfirm: () =>
          deleteCollection(this.props.match.params.id, data._id).then(() => {
            toast.warning("Collection deleted.");
            this.setState({ redirect: "/app/dashboard" });
          }),
      })
    );
  };

  handleResetCollectionSettings = () => {
    resetCollectionSettings(this.props.match.params.id).then(() => {
      toast.warning("Collection settings reseted");
    });
  };

  handleExportCollection = async (exportType) => {
    if (exportType === "json") {
      const res = await exportCollectionAsJSON(this.state.collection._id);
      const blob = await res.blob();
      download(blob, this.state.collection.title.trim() + ".json");
    }
  };

  handleDeleteCollectionSettingsPreset = (presetId) => {
    deleteCollectionSettings(this.state.collection._id, presetId).then(() => {
      let edits = this.state.editFieldsValues;
      delete edits[presetId];
      let collection = this.state.collection;
      for (let s in collection.settings)
        if (collection.settings[s]._id === presetId.toString()) {
          collection.settings.splice(s, 1);
          break;
        }
      this.setState({ editFieldsValues: edits, collection });
      toast.warning("Settings preset deleted");
    });
  };

  handleCloseShareModal = () => {
    this.setState({ shareModalIsOpen: false });
  };

  handleOpenShareModal = () => {
    this.setState({ shareModalIsOpen: true });
  };

  handleShareCollection = () => {
    // Share the collection
    this.setState({ shareModalLoading: true });
    shareCollection(
      this.props.match.params.id,
      this.state.shareInputEmail,
      this.state.shareInputAllowEditing
    )
      .then((d) => {
        let coll = this.state.collection;
        coll.sharedTo.push({
          userEmail: this.state.shareInputEmail,
          role: this.state.shareInputAllowEditing ? "edit" : "view",
        });
        toast.info("Collection shared with " + this.state.shareInputEmail);
        this.setState({
          shareModalLoading: false,
          shareInputEmail: "",
          shareInputAllowEditing: false,
          collection: coll,
        });
      })
      .finally(() => this.handleCloseShareModal());
  };

  handleStopSharing = (userEmail) => {
    this.setState({ loading: true });
    removeCollectionShare(this.props.match.params.id, userEmail)
      .then((d) => {
        let coll = this.state.collection;
        _.remove(coll.sharedTo, (n) => n.userEmail === userEmail);
        this.setState({ collection: coll, loading: false });
        toast.warning(`Stopped sharing with ${userEmail}`);
      })
      .catch((e) => {
        toast.error(`Oops, something went wrong..`);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleChangeCollectionVisibility = async (visibility) => {
    this.setState({ loading: true });
    try {
      await changeCollectionVisibility(this.props.match.params.id, visibility);
      toast.success(`The collection is now ${visibility}`);
      let collection = this.state.collection;
      collection.isPublic = visibility === "public";
      this.setState({ collection });
    } catch (ex) {
      toast.error("Oops, something went wrong...");
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { collection, titleEditActive } = this.state;
    return (
      <div className="view-small-border collection-options">
        <WorkspaceNav collectionId={this.props.match.params.id} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <div className="collection-options-content-div">
              <h2>General</h2>
              {!titleEditActive ? (
                <div>
                  <p>
                    <b>Title:</b> {collection.title}
                  </p>
                  <EditOutlinedIcon
                    className="collection-options-edit-button c-def"
                    onClick={() => {
                      let edits = this.state.editFieldsValues;
                      edits.title = collection.title;
                      this.setState({
                        titleEditActive: true,
                        editFieldsValues: edits,
                      });
                    }}
                  />
                </div>
              ) : (
                <div>
                  <p>
                    <b>Title:</b>
                  </p>
                  <Input
                    value={this.state.editFieldsValues["title"]}
                    outlined
                    onChange={(e) => {
                      let val = this.state.editFieldsValues;
                      val.title = e.target.value;
                      this.setState({ editFieldsValues: val });
                    }}
                  />
                  <CancelOutlinedIcon
                    className="collection-options-edit-button c-warning"
                    onClick={() => this.setState({ titleEditActive: false })}
                  />
                  <CheckOutlinedIcon
                    className="collection-options-edit-button c-success"
                    onClick={() => {
                      editCollection(collection._id, {
                        title: this.state.editFieldsValues.title,
                      }).then(() => {
                        toast.success("Collection updated.");
                        this.setState({
                          titleEditActive: false,
                          loading: true,
                        });
                        getCollectionNoPopulate(
                          this.props.match.params.id
                        ).then(({ data }) =>
                          this.setState({ collection: data, loading: false })
                        );
                      });
                    }}
                  />
                </div>
              )}
              <p style={{"margin": "0px 10px"}}>
                <b>Id:</b> {collection._id}
              </p>
              <p>
                <b>Owner:</b> {collection.ownerString}
              </p>
              <div className="mb20">
                <Checkbox
                  labelText="Open to public"
                  name={() => Math.floor(Math.random() * 1000).toString()}
                  noError
                  value={collection.isPublic}
                  onChange={async (e) => {
                    let newVisibility = e.target.checked ? "public" : "private";
                    // Change collection visibility
                    ConfirmDialog({
                      title: "Change collection visibility",
                      message: `Are you sure you want to make the collection ${newVisibility}?\nAnyone can view a public collection.`,
                      labelConfirm: `Make ${newVisibility}`,
                      labelDismiss: "Cancel",
                      onConfirm: async () =>
                        this.handleChangeCollectionVisibility(newVisibility),
                    });
                  }}
                />
              </div>
              {this.state.collection.isPublic && <p style={{"margin": "0px", "marginBottom": "20px"}}>
                <b>Public link: </b><a target="_blank" href={`${window.location.origin}/public-collections/${collection._id}`}>{`${window.location.origin}/public-collections/${collection._id}`}</a>
              </p>}
              <div>
                <Button
                  text="Delete collection"
                  classes={["mb10"]}
                  onClick={this.handleDeleteCollection}
                />
              </div>
              <div>
                <Button
                  text="Reset collection settings"
                  onClick={this.handleResetCollectionSettings}
                />
              </div>
            </div>
            <div className="collection-options-content-div">
              <h2>Collection settings presets</h2>
              {this.state.collection.settings.map((s) => (
                <div className="mb10 mt10" key={s._id}>
                  <Input
                    name={s._id}
                    outlined
                    type="text"
                    value={this.state.editFieldsValues[s._id]}
                    onChange={(e) => {
                      let edits = this.state.editFieldsValues;
                      edits[s._id] = e.target.value;
                      this.setState({ editFieldsValues: edits });
                    }}
                  />
                  {this.state.collection.settings.find(
                    (x) => x._id.toString() === s._id.toString()
                  ).name !== this.state.editFieldsValues[s._id] && (
                    <CheckOutlinedIcon
                      className="collection-options-edit-button c-success"
                      onClick={() => {
                        renameCollectionSettings(
                          collection._id,
                          s._id,
                          this.state.editFieldsValues[s._id]
                        ).then(() => {
                          let collection = this.state.collection;
                          for (let x of collection.settings) {
                            if (x._id === s._id) {
                              x.name = this.state.editFieldsValues[s._id];
                              break;
                            }
                          }
                          this.setState({ collection });
                          toast.info("Settings preset renamed");
                        });
                      }}
                    />
                  )}
                  <DeleteIcon
                    className="collection-options-edit-button c-danger"
                    onClick={() =>
                      ConfirmDialog({
                        title: "Delete collection",
                        message: `Are you sure you want to delete ${this.state.collection.title}?`,
                        labelConfirm: "Delete",
                        labelDismiss: "Cancel",
                        onConfirm: () =>
                          this.handleDeleteCollectionSettingsPreset(s._id),
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="collection-options-content-div">
              <h2>Export</h2>
              <div>
                {/* <Button style={{ margin: "10px" }} text="Excel" /> */}
                <Button
                  style={{ margin: "10px" }}
                  onClick={() => this.handleExportCollection("json")}
                  text="JSON {}"
                />
                {/* <Button style={{ margin: "10px" }} text="XML </>" /> */}
              </div>
            </div>
            <div className="collection-options-content-div">
              <h2>Sharing</h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {this.state.collection.sharedTo.map((s) => (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <p className="mr10">
                      <b>{s.userEmail}</b>
                    </p>
                    (
                    <Checkbox
                      labelText="Allow editing"
                      name={() => Math.floor(Math.random() * 1000).toString()}
                      noError
                      value={s.role === "edit"}
                      onChange={(e) => {
                        shareCollection(
                          this.props.match.params.id,
                          s.userEmail,
                          e.target.checked
                        ).then((d) => {
                          let coll = this.state.collection;
                          for (let c of coll.sharedTo) {
                            if (c.userEmail === s.userEmail) {
                              c.role = e.target.checked ? "view" : "edit";
                              break;
                            }
                          }
                          toast.info("Privileges edited for " + s.userEmail);
                          this.setState({
                            collection: coll,
                          });
                        });
                      }}
                    />
                    )
                    <DeleteIcon
                      className="collection-options-edit-button c-danger"
                      onClick={() =>
                        ConfirmDialog({
                          title: "Stop sharing",
                          message: `Are you sure you want to stop sharing with ${s.userEmail}?`,
                          labelConfirm: "Stop sharing",
                          labelDismiss: "Cancel",
                          onConfirm: () => this.handleStopSharing(s.userEmail),
                        })
                      }
                    />
                  </div>
                ))}
                <Button
                  style={{ margin: "10px" }}
                  onClick={() => this.handleOpenShareModal()}
                  text="+"
                />
              </div>
            </div>
          </React.Fragment>
        )}
        {/* Add share modal */}
        <ReactModal
          isOpen={this.state.shareModalIsOpen}
          className="collection-options-page-modal"
          overlayClassName="collection-options-page-modal-overlay"
          onRequestClose={this.handleCloseShareModal}
          shouldCloseOnOverlayClick={true}
        >
          <h1>New share</h1>
          {this.state.shareModalLoading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <Input
                name="add_share_input_email"
                placeholder="Email"
                type="email"
                value={this.state.shareInputEmail}
                onChange={(e) =>
                  this.setState({ shareInputEmail: e.target.value })
                }
              />
              <Checkbox
                labelText="Allow editing"
                name="add_share_input_allow_editing"
                noError
                value={this.state.shareInputAllowEditing}
                onChange={(e) => {
                  this.setState({ shareInputAllowEditing: e.target.checked });
                }}
              />
              <div className="mt20">
                <Button
                  text="Share"
                  style={{ margin: "0 4px" }}
                  onClick={this.handleShareCollection}
                />
              </div>
            </React.Fragment>
          )}
        </ReactModal>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}

export default CollectionOptionsPage;
