import { Formik, Form } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Button from "../common/button/button";
import Input from "../common/input/input";
import Select from "../common/select/select";
import Spinner from "../common/spinner/spinner";
import { Redirect } from "react-router-dom";

// TODO: Implement displaying column validation messages and on-server duplicite title checks
const CreateCollectionForm = ({redirectTarget, handleSubmit}) => {
  const getRandomKey = () => Math.floor(Math.random() * 1000000);

  const dataTypes = [
    { id: 0, type: "text" },
    { id: 1, type: "number" },
    { id: 2, type: "date" },
    { id: 3, type: "time" },
    { id: 4, type: "bool" },
  ];
  const [columns, setColumns] = useState([
    { key: getRandomKey(), columnName: "", dataType: "text" },
  ]);
  const [submitError, setSubmitError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const collectionSchema = Yup.object().shape({
    title: Yup.string()
      .max(30, "Title of your collection can have max 30 characters.")
      .required("This field cannot be empty."),
    model: Yup.array(),
  });

  const columnNameSchema = Yup.string()
    .max(20, "Collumn name can have max 20 characters.")
    .required("This field cannot be empty");

  const dataTypeSchema = Yup.string()
    .matches(
      /^(text|number|date|time|bool)$/,
      "Can be one of [text, number, date, time, bool]"
    )
    .required("Boy you gotta select something here :(");

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "60%",
  };

  const handleColumnFieldChange = (e, index) => {
    let col = columns;
    if (e.target instanceof HTMLInputElement)
      col[index].columnName = e.target.value;
    if (e.target instanceof HTMLSelectElement)
      col[index].dataType = dataTypes[e.target.value].type;
    setColumns(col);
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          title: "",
          model: [],
        }}
        validationSchema={collectionSchema}
        validateOnChange={false}
        onSubmit={async (formData, { resetForm, setSubmitting }) => {
          // TODO: Validation and form reset
          /*
                For now, the only validated field is "Collection title".
                User has no way of knowing why the form submit failed in the following cases:
                - Validation failed for one of the columns
                - Collection title duplicite
                - Column name duplicite (no validation for that at all)
                - Any validation error comming from the API
                - Any unexpected error / call fail comming from the API
                ^^ Im leaving it for now for time reasons, but ALL THAT HAS TO BE IMPLEMENTED sometime in the future, before the first public release!!!!
                Also, all the COLUMN FIELDS ARE RESETED after the form is submitted, no matter if the API call was successful or not
                ...however, if user does everything right, API call should result in 201 and a new collection should be created
            */
          // Perform validation inside columns array
          let cols = columns;
          let columnsAreValid = true;
          for (const c of cols) {
            try {
              await columnNameSchema.validate(c.columnName);
            } catch (err) {
              columnsAreValid = false;
              c.columnNameError = err.errors[0];
            }
            try {
              await dataTypeSchema.validate(c.dataType);
            } catch (ex) {
              columnsAreValid = false;
              c.dataTypeError = ex.errors[0];
            }
          }
          if (columnsAreValid) {
            setSubmitting(true);
            formData.model = columns.map(({ key, ...attrs }) => attrs);
            await handleSubmit(formData);
            setSubmitting(false);
            setRedirect(true);
          } else setColumns(cols);
          console.log("Column validation failed!");
          console.log(columns);
        }}
      >
        {({ values, errors, handleChange, isSubmitting }) =>
          !isSubmitting ? (
            <Form style={formStyles}>
              <Input
                error={errors.title}
                name="title"
                placeholder="Title / name of your collection"
                type="text"
                value={values.title}
                onChange={handleChange}
              />
              <hr />
              {/* Data structure fields for n collection columns */}
              <div>
                {columns.map((c) => (
                  // TODO: fix terrible spaghetti code below :(
                  // I know, it is terrible, but im rushing like hell and I dont have time to fix it, sowy..
                  // fix note: the map solution is probably unnecessary and stupid, for-each might work better
                  // (but it didnt work for me, probably because im an idiot and was doing it somehow wrong)
                  // fix note2: use fieldArray component from Formik
                  <fieldset key={c.key}>
                    <legend>
                      <button
                        disabled={columns.length === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (columns.length > 1)
                            setColumns(columns.filter((x) => x.key.toString() !== c.key));
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </legend>
                    <Input
                      error={
                        columns.findIndex((x) => x.key.toString() === c.key.toString()).columnNameError
                      }
                      name={columns.findIndex((x) => x.key.toString() === c.key.toString()).key}
                      placeholder="Title of a column"
                      type="text"
                      value={
                        columns.findIndex((x) => x.key.toString() === c.key.toString()).columnName
                      }
                      onChange={(e) =>
                        handleColumnFieldChange(
                          e,
                          columns.findIndex((x) => x.key.toString() === c.key.toString())
                        )
                      }
                    />
                    <Select
                      error={
                        columns.findIndex((x) => x.key.toString() === c.key.toString()).dataTypeError
                      }
                      name={c.key + "_select"}
                      onChange={(e) =>
                        handleColumnFieldChange(
                          e,
                          columns.findIndex((x) => x.key.toString() === c.key.toString())
                        )
                      }
                      options={dataTypes}
                      textKey="type"
                      valueKey="id"
                      placeholder="Data type"
                    />
                  </fieldset>
                ))}
              </div>
              <Button
                style={{ marginBottom: "10px" }}
                outline
                text={
                  columns.length < 10 ? "Add column" : "Add column (max 10)"
                }
                disabled={columns.length === 10}
                onClick={(e) => {
                  e.preventDefault();
                  if (columns.length < 10)
                    setColumns([
                      ...columns,
                      { key: getRandomKey(), columnName: "", dataType: "" },
                    ]);
                  else setSubmitError("Collection can have max 10 columns.");
                }}
              />
              <Button text="Create" type="submit" />
              {submitError && (
                <p style={{ color: "red", fontWeight: "300" }}>{submitError}</p>
              )}
            </Form>
          ) : (
            <Spinner />
          )
        }
      </Formik>
      {redirect && <Redirect to={redirectTarget} />}
    </React.Fragment>
  );
};

export default CreateCollectionForm;
