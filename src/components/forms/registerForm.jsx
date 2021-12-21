import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Input from "../common/input/input";
import Button from "../common/button/button";
import Spinner from "../common/spinner/spinner";
import * as userService from "../../services/api/usersService";
import * as authService from "../../services/authService";

const RegisterForm = (props) => {
  const [submitError, setSubmitError] = useState("");

  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "At least 2 characters long.")
      .max(10, "Maximum 10 characters long.")
      .required(),
    email: Yup.string()
      .min(4, "Email has to be at least 4 characters long.")
      .max(50, "Email cannot be longer than 50 characters.")
      .email("This is not a valid email address.")
      .required("This field cannot be empty."),
    password: Yup.string()
      .min(8, "Password has to be at least 8 characters long.")
      .max(255, "Password can not be longer than 255 characters.")
      .required("This field cannot be empty."),
  });

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "60%",
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={registerSchema}
        validateOnChange={false}
        onSubmit={async (formData, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          try {
            const { data : token } = await userService.registerUser(formData);
            authService.loginWithJwt(token);

            resetForm();
            window.location = "/verify";
          } catch (ex) {
            if (ex.response && ex.response.status === 400) {
              setSubmitError(ex.response.data);
            }
          }
          setSubmitting(false);
        }}
      >
        {({ values, errors, handleChange, isSubmitting }) =>
          !isSubmitting ? (
            <Form style={formStyles}>
              <Input
                error={errors.name}
                name="name"
                placeholder="How should we call you?"
                type="text"
                value={values.name}
                onChange={handleChange}
              />
              <Input
                error={errors.email}
                name="email"
                placeholder="Your email"
                type="text"
                value={values.email}
                onChange={handleChange}
              />
              <Input
                error={errors.password}
                name="password"
                placeholder="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
              <Button text="Register" type="submit" />
              {submitError && (
                <p style={{ color: "red", fontWeight: "300" }}>
                  {submitError}
                </p>
              )}
            </Form>
          ) : (
            <Spinner />
          )
        }
      </Formik>
    </React.Fragment>
  );
};

export default RegisterForm;
