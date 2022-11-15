import React, { useState, useContext } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAPI from "../../Services/APIs/Common/useAPI";
import Auth from "../../Services/APIs/Auth/Auth";
import { LoginContext } from "../../Store/LoginContext";

export default function Login() {
    const context = useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(false);
    const [connectCode, setConnectCode] = useState(0);
    const loginAPI = useAPI(Auth.login);

    const signInSchema = Yup.object().shape({
      email: Yup.string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),
      password: Yup.string()
        .required("Senha é obrigatório")
        .min(4, "O senha deve ter ao menos 4 caracteres"),
    });
    const onClickLogin = (values) => {
      console.log(values);
      console.log(values);
      let payload = {
        email: values.email,
        password: values.password,
      };

      setConnectCode(0);
      setIsLoading(true);

      loginAPI
        .requestPromise(payload)
        .then((info) => {
            console.log(info);
            console.log(info.token);
          setConnectCode(1);
          setIsLoading(false);
          context.onMakeLogin(info.token);
        })
        .catch((info) => {
          setConnectCode(-1);
          setIsLoading(false);
        });
    };

    let buttonInfo = null;
    let buttonCadastrar = null;
    let alertComp = null;

    if (isLoading) {
      buttonInfo = <CircularProgress color="primary" />;
    } else if (connectCode === 1) {
      alertComp = <Alert severity="success">Logado com sucesso</Alert>;
    } else {
      if (connectCode !== 0) {
        alertComp = (
          <Alert severity="error">
            Houve um erro ao conectar. Tente novamente mais tarde
          </Alert>
        );
      }
      buttonInfo = (
        <Button variant="primary" type="submit">
          Entrar
        </Button>
      );
      buttonCadastrar = (
        <Button variant="primary" type="submit">
            Cadastrar-se
        </Button>
      );
    }
return (
  <Container>
    <Box className="contentBox">
      <div className="TitlePage">
        <Typography variant="h1" color="primary">
          Login
        </Typography>
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={signInSchema}
        onSubmit={onClickLogin}
      >
        {(formik) => {
          const { errors, setFieldValue, values } = formik;
          return (
            <Form>
              <TextField
                required
                id="outlined-required"
                label="E-mail"
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />
              <p></p>
              <ErrorMessage
                component="div"
                className="errorMessage"
                name="email"
              />
              <p></p>
              <TextField
                required
                id="outlined-required"
                label="Senha"
                type="password"
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />
              <p></p>
              <ErrorMessage
                component="div"
                className="errorMessage"
                name="password"
              />
              <p></p>
              <div className="col-sm-6">
                {buttonInfo}
              </div>
              <div className="col-sm-6">
                {buttonCadastrar}
              </div>
              
              {alertComp}
            </Form>
          );
        }}
      </Formik>
    </Box>
  </Container>
);
}