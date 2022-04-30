import React, { Component } from "react";
import Spinner from "../../../../components/common/spinner/spinner";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import "./collectionActionsPage.css";
import {
  getCollectionNoPopulate,
  getCollectionActions,
  getCollectionModel,
  updateCollectionActionConnectors,
  updateCollectionActionRunners,
  testActionsConnector,
} from "../../../../services/api/collectionsService";
import { FieldArray, Form, Formik } from "formik";
import Input from "../../../../components/common/input/input";
import Button from "../../../../components/common/button/button";
import Select from "../../../../components/common/select/select";
import { toast } from "react-toastify";

class CollectionActionsPage extends Component {
  state = {
    loading: true,
    collection: {},
  };

  componentDidMount() {
    getCollectionNoPopulate(this.props.match.params.id).then(({ data }) => {
      let collection = data;
      getCollectionActions(collection._id).then(({ data: actions }) => {
        collection.actions = actions;
        getCollectionModel(collection._id).then(({ data: model }) => {
          collection.model = model;
          this.setState({ collection, loading: false });
        });
      });
    });
  }

  connectorFormStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "column",
    margin: "10px",
  };

  recieversFormStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "10px",
    alignSelf: "center",
  };

  recieverInputStyle = {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px",
  };

  runnersInputStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: "10px",
    alignSelf: "center",
  };

  runnerInputStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "column",
    margin: "10px",
  };

  defaultActionRunner = {
    connector: "",
    column: "",
    operand: "",
    target: "",
  };

  actionConnectorOptions = [
    { key: "email", val: "Email" },
    { key: "telegram", val: "Telegram" },
  ];

  actionRunnerOperands = [
    { key: "equal", val: "equal" },
    { key: "=", val: "=" },
    { key: "<", val: "<" },
    { key: ">", val: ">" },
    { key: ">=", val: ">=" },
    { key: "<=", val: "<=" },
  ];

  handleUpdateConnectors = async (connectorType, payload) => {
    let update = { ...this.state.collection.actions.connectors };
    update[connectorType] = payload;
    await updateCollectionActionConnectors(this.state.collection._id, update);
    testActionsConnector(this.state.collection._id, connectorType);
    toast.info("Connector updated");
  };

  handleUpdateActionRunners = async (payload) => {
    let update = { ...this.state.collection.actions.value };
    update = payload.value;
    await updateCollectionActionRunners(this.state.collection._id, update);
    toast.info("Runners updated");
  };

  render() {
    const { collection, loading } = this.state;

    return (
      <div className="view-small-border collection-actions">
        <WorkspaceNav collectionId={this.props.match.params.id} />
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="collection-actions-content-div">
              <h2>Connectors</h2>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {/* Email connector settings */}
                <Formik
                  initialValues={collection.actions.connectors.email}
                  onSubmit={async (formData, { setSubmitting }) => {
                    setSubmitting(true);
                    await this.handleUpdateConnectors("email", formData);
                    setSubmitting(false);
                  }}
                >
                  {({ values, handleChange, isSubmitting }) =>
                    !isSubmitting ? (
                      <Form>
                        <fieldset style={this.connectorFormStyle}>
                          <legend>Email</legend>
                          <div className="mt10">
                            <Input
                              name="host"
                              labelText="Host"
                              type="text"
                              value={values.host}
                              outlined
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mt10">
                            <Input
                              name="user"
                              labelText="User"
                              type="email"
                              value={values.user}
                              outlined
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mt10">
                            <Input
                              name="password"
                              labelText="Password"
                              type="password"
                              value={values.password}
                              outlined
                              onChange={handleChange}
                            />
                          </div>
                          <FieldArray
                            name="recievers"
                            render={(arrayHelpers) => (
                              <div style={this.recieversFormStyle}>
                                <p>Recievers</p>
                                {values.recievers.map((reciever, index) => (
                                  <div style={this.recieverInputStyle}>
                                    <Input
                                      name={`recievers[${index}]`}
                                      placeholder="Reciever email"
                                      type="email"
                                      value={values.recievers[index]}
                                      outlined
                                      onChange={handleChange}
                                    />
                                    <Button
                                      text="-"
                                      type="button"
                                      outline
                                      classes="self-center"
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                ))}
                                <Button
                                  text="+"
                                  type="button"
                                  outline
                                  classes="self-center"
                                  onClick={() => arrayHelpers.push("")}
                                />
                              </div>
                            )}
                          />
                          <Button
                            text="Save and test"
                            type="submit"
                            classes="self-center"
                          />
                        </fieldset>
                      </Form>
                    ) : (
                      <Spinner />
                    )
                  }
                </Formik>
                {/* Telegram connector settings */}
                <Formik
                  initialValues={collection.actions.connectors.telegram}
                  onSubmit={async (formData, { setSubmitting }) => {
                    setSubmitting(true);
                    await this.handleUpdateConnectors("telegram", formData);
                    setSubmitting(false);
                  }}
                >
                  {({ values, handleChange, isSubmitting }) =>
                    !isSubmitting ? (
                      <Form>
                        <fieldset style={this.connectorFormStyle}>
                          <legend>Telegram</legend>
                          <div className="mt10">
                            <Input
                              name="chatId"
                              labelText="Chat Id"
                              type="text"
                              value={values.chatId}
                              outlined
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mt10 mb10">
                            <Input
                              name="botToken"
                              labelText="Bot token"
                              type="text"
                              value={values.botToken}
                              outlined
                              onChange={handleChange}
                            />
                          </div>
                          <Button
                            text="Save and test"
                            type="submit"
                            classes="self-center"
                          />
                        </fieldset>
                      </Form>
                    ) : (
                      <Spinner />
                    )
                  }
                </Formik>
              </div>
              <h2>Actions</h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Formik
                  initialValues={collection.actions}
                  onSubmit={async (formData, { setSubmitting }) => {
                    setSubmitting(true);
                    await this.handleUpdateActionRunners(formData);
                    setSubmitting(false);
                  }}
                >
                  {({ values, handleChange, isSubmitting }) =>
                    !isSubmitting ? (
                      <Form>
                        <FieldArray
                          name="value"
                          render={(arrayHelpers) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div style={this.runnersInputStyle}>
                                {values.value.map((reciever, index) => (
                                  <fieldset>
                                    <div style={this.runnerInputStyle}>
                                      <div className="mb10">
                                        <Select
                                          labelText="Connector: "
                                          options={this.actionConnectorOptions}
                                          textKey="val"
                                          valueKey="key"
                                          placeholder="None selected"
                                          noError
                                          outline
                                          name={`value[${index}].connector`}
                                          value={values.value[index].connector}
                                          onChange={handleChange}
                                        />
                                      </div>
                                      <div className="mb10">
                                        <Select
                                          labelText="Column: "
                                          options={collection.model.value}
                                          textKey="columnName"
                                          valueKey="columnName"
                                          placeholder="None selected"
                                          noError
                                          outline
                                          name={`value[${index}].column`}
                                          value={values.value[index].column}
                                          onChange={handleChange}
                                        />
                                      </div>
                                      <div className="mb10">
                                        <Select
                                          labelText="Operand: "
                                          options={this.actionRunnerOperands}
                                          textKey="val"
                                          valueKey="key"
                                          placeholder="None selected"
                                          noError
                                          outline
                                          name={`value[${index}].operand`}
                                          value={values.value[index].operand}
                                          onChange={handleChange}
                                        />
                                      </div>
                                      <div className="mb10">
                                        <Input
                                          name={`value[${index}].target`}
                                          labelText="Target"
                                          type="text"
                                          value={values.value[index].target}
                                          outlined
                                          onChange={handleChange}
                                        />
                                      </div>
                                      <Button
                                        text="-"
                                        type="button"
                                        outline
                                        classes="self-center mb10"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      />
                                    </div>
                                  </fieldset>
                                ))}
                              </div>
                              <Button
                                text="+"
                                type="button"
                                outline
                                classes="self-center"
                                onClick={() =>
                                  arrayHelpers.push(this.defaultActionRunner)
                                }
                              />
                              <Button
                                text="Save"
                                type="submit"
                                classes="self-center mt10"
                              />
                            </div>
                          )}
                        />
                      </Form>
                    ) : (
                      <Spinner />
                    )
                  }
                </Formik>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default CollectionActionsPage;
