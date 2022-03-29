import React from "react";
import { Formik, Form } from "formik";
import Input from "../common/input/input";
import Select from "../common/select/select";
import Button from "../common/button/button";

const PieGraphSettingsForm = ({
  initialCollectionSettings: initialSettings,
  collectionModel,
  handleSaveSettings,
  handleCloseSettings,
}) => {
  let columns = [];
  for (const column of collectionModel.value) {
    columns.push({
      text: column["columnName"],
      value: column["columnName"],
      type: column["dataType"],
    });
  }

  const formFieldStyle = {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px",
  };

  const fieldsetStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const axisFieldsetsContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-start",
    justifyContent: "center",
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={initialSettings}
        validate={false}
        onSubmit={(formData) => {
          handleSaveSettings(formData, "pieGraph");
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <div style={axisFieldsetsContainerStyle}>
              <fieldset style={fieldsetStyle}>
                <legend>Pie</legend>
                {/* Data Key */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Data key: "
                    options={columns}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="dataKey"
                    value={values.dataKey}
                    onChange={handleChange}
                  />
                </div>
                {/* Name Key */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Name key: "
                    options={columns}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="nameKey"
                    value={values.nameKey}
                    onChange={handleChange}
                  />
                </div>
                {/* Fill */}
                <div style={formFieldStyle}>
                  <Input
                    labelText="Fill color: "
                    noError
                    name="fill"
                    type="color"
                    value={values.fill}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                text="Close"
                onClick={(e) => {
                  e.preventDefault();
                  handleCloseSettings();
                }}
                outline
              />
              <Button text="Save" classes={["ml10"]} type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default PieGraphSettingsForm;
