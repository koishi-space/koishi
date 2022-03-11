import React from "react";
import { Formik, Form, FieldArray } from "formik";
import Input from "../common/input/input";
import Select from "../common/select/select";
import Button from "../common/button/button";
import Checkbox from "../common/checkbox/checkbox";

const RadarGraphSettingsForm = ({
  initialCollectionSettings: initialSettings,
  collectionModel,
  handleSaveSettings,
  handleCloseSettings,
}) => {
  console.log(initialSettings);
  let columns = [];
  for (const column of collectionModel.value) {
    columns.push({
      text: column["columnName"],
      value: column["columnName"],
      type: column["dataType"],
    });
  }

  let defaultRadar = {
    name: "",
    dataKey: "",
    fill: "#ad37e8",
    dot: false,
    activeDot: false,
    label: false,
    hide: false,
  };

  let axisRangePresets = [
    { value: "auto", text: "Auto" },
    { value: "dataMin", text: "Data min" },
    { value: "dataMax", text: "Data max" },
    { value: "custom", text: "Custom" },
  ];

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

  const barsFieldsetStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const axisFieldsetsContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-start",
    justifyContent: "center",
  };

  const barFieldStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "10px",
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={initialSettings}
        validate={false}
        onSubmit={(formData) => {
          formData.radialAngleAxis.range.fromCustom =
            formData.radialAngleAxis.range.fromCustom.toString();
          formData.radialAngleAxis.range.toCustom =
            formData.radialAngleAxis.range.toCustom.toString();

          handleSaveSettings(formData, "radarGraph");
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <div style={axisFieldsetsContainerStyle}>
              {/* Polar Angle Axis */}
              <fieldset style={fieldsetStyle}>
                <legend>Polar angle axis</legend>
                {/* Data key */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Data key: "
                    options={columns}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="polarAngleAxis.dataKey"
                    value={values.polarAngleAxis.dataKey}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
              {/* Radial Angle Axis*/}
              <fieldset style={fieldsetStyle}>
                <legend>Radial angle axis</legend>
                {/* Data key */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Data key: "
                    options={columns}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="radialAngleAxis.dataKey"
                    value={values.radialAngleAxis.dataKey}
                    onChange={handleChange}
                  />
                </div>
                {/* Data Range - From */}
                <div style={formFieldStyle}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      labelText="Range from: "
                      options={axisRangePresets}
                      textKey="text"
                      valueKey="value"
                      noError
                      outline
                      name="radialAngleAxis.range.from"
                      value={values.radialAngleAxis.range.from}
                      onChange={handleChange}
                    />
                    {values.radialAngleAxis.range.from === "custom" && (
                      <div className="ml10">
                        {values.polarAngleAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="radialAngleAxis.range.fromCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.polarAngleAxis.dataKey
                              )[0].type
                            }
                            value={values.radialAngleAxis.range.fromCustom}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify polar axis data key</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Data Range - To */}
                <div style={formFieldStyle}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      labelText="Range to: "
                      options={axisRangePresets}
                      textKey="text"
                      valueKey="value"
                      noError
                      outline
                      name="radialAngleAxis.range.to"
                      value={values.radialAngleAxis.range.to}
                      onChange={handleChange}
                    />
                    {values.radialAngleAxis.range.to === "custom" && (
                      <div className="ml10">
                        {values.polarAngleAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="radialAngleAxis.range.toCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.polarAngleAxis.dataKey
                              )[0].type
                            }
                            value={values.radialAngleAxis.range.toCustom}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify axis data key</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Radars */}
            <FieldArray
              name="radars"
              render={(arrayHelpers) => (
                <fieldset style={barsFieldsetStyle}>
                  <legend>Radars</legend>
                  {values.radars.map((radar, index) => (
                    <div key={index} style={barsFieldsetStyle}>
                      <Select
                        labelText="Data key: "
                        options={columns}
                        textKey="text"
                        valueKey="value"
                        placeholder="None selected"
                        outline
                        noError
                        name={`radars[${index}].dataKey`}
                        onChange={handleChange}
                        value={values.radars[index].dataKey}
                      />
                      <Input
                        labelText="Fill color: "
                        noError
                        name={`radars[${index}].fill`}
                        type="color"
                        value={values.radars[index].fill}
                        onChange={handleChange}
                      />
                      <Input
                        labelText="Name: "
                        outlined
                        noError
                        name={`radars[${index}].name`}
                        type="text"
                        value={values.radars[index].name}
                        onChange={handleChange}
                      />
                      {/* Show dots */}
                      <Checkbox
                        labelText="Dots"
                        name={`radars[${index}].dot`}
                        noError
                        value={values.radars[index].dot}
                        onChange={handleChange}
                      />
                      {/* Show active dots */}
                      <Checkbox
                        labelText="Active dots"
                        name={`radars[${index}].activeDot`}
                        noError
                        value={values.radars[index].activeDot}
                        onChange={handleChange}
                      />
                      {/* Show labels */}
                      <Checkbox
                        labelText="Show labels"
                        name={`radars[${index}].label`}
                        noError
                        value={values.radars[index].label}
                        onChange={handleChange}
                      />
                      {/* Hide */}
                      <Checkbox
                        labelText="Hide"
                        name={`radars[${index}].hide`}
                        noError
                        value={values.radars[index].hide}
                        onChange={handleChange}
                      />

                      <Button
                        text="-"
                        outline
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      />
                    </div>
                  ))}

                  <Button
                    text="+"
                    outline
                    type="button"
                    onClick={() => arrayHelpers.push(defaultRadar)}
                  />
                </fieldset>
              )}
            />
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

export default RadarGraphSettingsForm;
