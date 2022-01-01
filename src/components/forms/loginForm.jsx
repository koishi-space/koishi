import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Input from "../common/input/input";
import Button from "../common/button/button";
import Spinner from "../common/spinner/spinner";
import auth from "../../services/authService";
// import { Redirect } from "react-router";

const LoginForm = () => {
  const [invalidLogin, setInvalidLogin] = useState(false);
  // const [redirect, setRedirect] = useState(false);

  const loginSchema = Yup.object().shape({
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
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        validateOnChange={false}
        onSubmit={async (formData, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          const authed = await auth.login(formData.email, formData.password);
          if (authed) {
            setInvalidLogin(false);
            setSubmitting(false);
            resetForm();
            // TODO: fix spaghetti code below (https://stackoverflow.com/questions/39833140/react-how-do-i-access-a-component-from-another-component)
            // there is a better way to do the following - via hooks, not by reloading the whole page
            // however it is like this just for now for simplicity
            window.location = "/app/dashboard";
            // setRedirect(true);
          } else {
            setInvalidLogin(true);
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, handleChange, isSubmitting }) =>
          !isSubmitting ? (
            <Form style={formStyles}>
              <Input
                error={errors.email}
                name="email"
                placeholder="Email"
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
              <Button text="Login" type="submit" />
              {invalidLogin && (
                <p style={{ color: "red", fontWeight: "300" }}>
                  Wrong email or password.
                </p>
              )}
            </Form>
          ) : (
            <Spinner />
          )
        }
      </Formik>
      {/* {redirect && <Redirect to="/" />} */}
    </React.Fragment>
  );
};

export default LoginForm;
