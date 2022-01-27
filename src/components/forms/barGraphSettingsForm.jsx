import React from "react";
import { Formik, Form, FieldArray } from "formik";
import Input from "../common/input/input";
import Select from "../common/select/select";
import Button from "../common/button/button";
import Checkbox from "../common/checkbox/checkbox";

const BarGraphSettingsForm = ({
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

  let axisDataTypes = [
    { value: "number", text: "Number" },
    { value: "category", text: "Category" },
  ];

  let axisRangePresets = [
    { value: "auto", text: "Auto" },
    { value: "dataMin", text: "Data min" },
    { value: "dataMax", text: "Data max" },
    { value: "custom", text: "Custom" },
  ];

  let axisScales = [
    { value: "auto", text: "Auto" },
    { value: "linear", text: "Linear" },
    { value: "pow", text: "Pow" },
    { value: "sqrt", text: "Sqrt" },
    { value: "log", text: "Log" },
  ];

  let defaultBar = {
    dataKey: "",
    fill: "#8884d8",
    unit: "",
    name: "",
    stackId: "",
    hide: false,
  };

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
          formData.xAxis.range.fromCustom =
            formData.xAxis.range.fromCustom.toString();
          formData.xAxis.range.toCustom =
            formData.xAxis.range.toCustom.toString();
          formData.yAxis.range.fromCustom =
            formData.yAxis.range.fromCustom.toString();
          formData.yAxis.range.toCustom =
            formData.yAxis.range.toCustom.toString();

          handleSaveSettings(formData);
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <div style={axisFieldsetsContainerStyle}>
              {/* X axis */}
              <fieldset style={fieldsetStyle}>
                <legend>X axis</legend>
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
                    name="xAxis.dataKey"
                    value={values.xAxis.dataKey}
                    onChange={handleChange}
                  />
                </div>
                {/* Data type */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Data type: "
                    options={axisDataTypes}
                    textKey="text"
                    valueKey="value"
                    noError
                    outline
                    name="xAxis.type"
                    value={values.xAxis.type}
                    onChange={handleChange}
                  />
                </div>
                {/* Allow Decimals */}
                {values.xAxis.type === "number" && (
                  <div style={formFieldStyle}>
                    <Checkbox
                      labelText="Allow decimals"
                      name="xAxis.allowDecimals"
                      noError
                      value={values.xAxis.allowDecimals}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {/* Hide */}
                <div style={formFieldStyle}>
                  <Checkbox
                    labelText="Hidden"
                    name="xAxis.hide"
                    noError
                    type="checkbox"
                    value={values.xAxis.hide}
                    onChange={handleChange}
                  />
                </div>
                {/* Allow Data Overflow */}
                <div style={formFieldStyle}>
                  <Checkbox
                    labelText="Allow data overflow"
                    name="xAxis.allowDataOverflow"
                    noError
                    value={values.xAxis.allowDataOverflow}
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
                      name="xAxis.range.from"
                      value={values.xAxis.range.from}
                      onChange={handleChange}
                    />
                    {values.xAxis.range.from === "custom" && (
                      <div className="ml10">
                        {values.xAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="xAxis.range.fromCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.xAxis.dataKey
                              )[0].type
                            }
                            value={values.xAxis.range.fromValue}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify axis data key</p>
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
                      name="xAxis.range.to"
                      value={values.xAxis.range.to}
                      onChange={handleChange}
                    />
                    {values.xAxis.range.to === "custom" && (
                      <div className="ml10">
                        {values.xAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="xAxis.range.toCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.xAxis.dataKey
                              )[0].type
                            }
                            value={values.xAxis.range.toCustom}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify axis data key</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Axis Label */}
                <div style={formFieldStyle}>
                  <Input
                    labelText="Axis label: "
                    noError
                    name="xAxis.label"
                    outlined
                    type="text"
                    value={values.xAxis.label}
                    onChange={handleChange}
                  />
                </div>
                {/* Axis unit */}
                <div style={formFieldStyle}>
                  <Input
                    labelText="Axis unit: "
                    noError
                    name="xAxis.unit"
                    outlined
                    type="text"
                    value={values.xAxis.unit}
                    onChange={handleChange}
                  />
                </div>
                {/* Axis Scale */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Scale: "
                    options={axisScales}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="xAxis.scale"
                    value={values.xAxis.scale}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>

              {/* Y axis */}
              <fieldset style={fieldsetStyle}>
                <legend>Y axis</legend>
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
                    name="yAxis.dataKey"
                    value={values.yAxis.dataKey}
                    onChange={handleChange}
                  />
                </div>
                {/* Data type */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Data type: "
                    options={axisDataTypes}
                    textKey="text"
                    valueKey="value"
                    noError
                    outline
                    name="yAxis.type"
                    value={values.yAxis.type}
                    onChange={handleChange}
                  />
                </div>
                {/* Allow Decimals */}
                {values.yAxis.type === "number" && (
                  <div style={formFieldStyle}>
                    <Checkbox
                      labelText="Allow decimals"
                      name="yAxis.allowDecimals"
                      noError
                      value={values.yAxis.allowDecimals}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {/* Hide */}
                <div style={formFieldStyle}>
                  <Checkbox
                    labelText="Hidden"
                    name="yAxis.hide"
                    noError
                    value={values.yAxis.hide}
                    onChange={handleChange}
                  />
                </div>
                {/* Allow Data Overflow */}
                <div style={formFieldStyle}>
                  <Checkbox
                    labelText="Allow data overflow"
                    name="yAxis.allowDataOverflow"
                    noError
                    value={values.yAxis.allowDataOverflow}
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
                      name="yAxis.range.from"
                      value={values.yAxis.range.from}
                      onChange={handleChange}
                    />
                    {values.yAxis.range.from === "custom" && (
                      <div className="ml10">
                        {values.yAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="yAxis.range.fromCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.yAxis.dataKey
                              )[0].type
                            }
                            value={values.yAxis.range.fromCustom}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify Y axis data key</p>
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
                      name="yAxis.range.to"
                      value={values.yAxis.range.to}
                      onChange={handleChange}
                    />
                    {values.yAxis.range.to === "custom" && (
                      <div className="ml10">
                        {values.yAxis.dataKey.length > 0 ? (
                          <Input
                            noError
                            name="yAxis.range.toCustom"
                            outlined
                            type={
                              columns.filter(
                                (x) => x.value === values.yAxis.dataKey
                              )[0].type
                            }
                            value={values.yAxis.range.toCustom}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>Please specify Y axis data key</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Axis Label */}
                <div style={formFieldStyle}>
                  <Input
                    labelText="Axis label: "
                    noError
                    name="yAxis.label"
                    outlined
                    type="text"
                    value={values.yAxis.label}
                    onChange={handleChange}
                  />
                </div>
                {/* Axis unit */}
                <div style={formFieldStyle}>
                  <Input
                    labelText="Axis unit: "
                    noError
                    name="yAxis.unit"
                    outlined
                    type="text"
                    value={values.yAxis.unit}
                    onChange={handleChange}
                  />
                </div>
                {/* Axis Scale */}
                <div style={formFieldStyle}>
                  <Select
                    labelText="Scale: "
                    options={axisScales}
                    textKey="text"
                    valueKey="value"
                    placeholder="None selected"
                    noError
                    outline
                    name="yAxis.scale"
                    value={values.yAxis.scale}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
            </div>

            {/* Bars */}
            <FieldArray
              name="bars"
              render={(arrayHelpers) => (
                <fieldset style={barsFieldsetStyle}>
                  <legend>Bars</legend>
                  {values.bars.map((bar, index) => (
                    <div key={index} style={barFieldStyle}>
                      <Select
                        labelText="Data key: "
                        options={columns}
                        textKey="text"
                        valueKey="value"
                        placeholder="None selected"
                        outline
                        noError
                        name={`bars[${index}].dataKey`}
                        onChange={handleChange}
                        value={values.bars[index].dataKey}
                      />
                      <Input
                        labelText="Bar color: "
                        noError
                        name={`bars[${index}].fill`}
                        type="color"
                        value={values.bars[index].fill}
                        onChange={handleChange}
                      />
                      <Input
                        labelText="Unit: "
                        outlined
                        noError
                        name={`bars[${index}].unit`}
                        type="text"
                        value={values.bars[index].unit}
                        onChange={handleChange}
                      />
                      <Input
                        labelText="Name: "
                        outlined
                        noError
                        name={`bars[${index}].name`}
                        type="text"
                        value={values.bars[index].name}
                        onChange={handleChange}
                      />
                      <Input
                        labelText="Stack Id: "
                        noError
                        outlined
                        name={`bars[${index}].stackId`}
                        type="text"
                        value={values.bars[index].stackId}
                        onChange={handleChange}
                      />
                      <Checkbox
                      labelText="Hide"
                      name={`bars[${index}].hide`}
                      noError
                      value={values.bars[index].hide}
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
                    onClick={() => arrayHelpers.push(defaultBar)}
                  />
                </fieldset>
              )}
            />
            <div style={{display: "flex", justifyContent: "center"}}><Button
              text="Close"
              onClick={(e) => {
                e.preventDefault();
                handleCloseSettings();
              }}
              outline
            />
            <Button text="Save" classes={["ml10"]} type="submit" /></div>
            
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default BarGraphSettingsForm;
