import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAPI from "../../Services/APIs/Common/useAPI";
import Person from "../../Services/APIs/Persons/Persons";
import "./Detail.css"

export default function Detail() {

  const updatePersonAPI = useAPI(Person.updatePersons);
  const addPersonAPI = useAPI(Person.addPersons);
  const [isLoading, setIsLoading] = useState(false)
  const [connectCode, setConnectCode] = useState(0)

  const { infoID } = useParams();
  console.log(infoID);
  const {
    state: { person },
  } = useLocation();

  const parsedPerson = JSON.parse(person);
  console.log(parsedPerson);

  let navigate = useNavigate();

  const onBackButton = () => {
    navigate(-1);
  };

  const signInSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Primeiro nome é obrigatório")
      .min(2, "O primeiro nome deve ter ao menos 2 caracteres"),
    lastName: Yup.string()
      .required("Sobrenome é obrigatório")
      .min(2, "O sobrenome deve ter ao menos 2 caracteres"),
    jobTitle: Yup.string()
      .required("A profissão é obrigatório")
      .min(2, "A profissão deve ter ao menos 2 caracteres"),
    CPF: Yup.string()
      .required("CPF é obrigatório")
      .matches(
        /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})+$/,
        "Is not in correct format"
      ),
  });

  const onSubmit = (values) => {
    console.log(values);
    let payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      jobTitle: values.jobTitle,
      CPF: values.CPF,
    };

    setConnectCode(0);
    setIsLoading(true)    
    if(parseInt(infoID,10) === -1){
      addPersonAPI
        .requestPromise(payload)
        .then(connectSuccess)
        .catch(connectError);
    } else {
      updatePersonAPI
        .requestPromise(parsedPerson._id, payload)
        .then(connectSuccess)
        .catch(connectError);
    }    
  };

  const connectSuccess = (info) => {
    console.log("Retornando Info");
    console.log(info.codeInfo.id);
    setIsLoading(false);
    if (info.codeInfo.id === 1) {
      setConnectCode(1);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } else {
      setConnectCode(-1);
    }
  };

  const connectError = (info) => {
    console.log("Retornando Info Erro");
    console.log(info);
    setConnectCode(-1);
  };

  let pageTitleText = "Alterar informação da pessoa";
  let successConnectText = "Alteração realizada com sucesso!";
  let buttonText = "Alterar";
  if(parseInt(infoID,10) === -1){
    pageTitleText = "Adicionar nova pessoa";
    successConnectText = "Inserção realizada com sucesso!";
    buttonText = "Adicionar";
  }
  let buttonInfo = null;
  let alertComp = null;
  if(isLoading){
    buttonInfo = <CircularProgress color="secondary" />;
  } else if (connectCode === 1){
    alertComp = <Alert severity="success">{successConnectText}</Alert>;    
  } else {
    if ( connectCode !== 0){
      alertComp = (
        <Alert severity="error">
          Houve um erro ao conectar. Tente novamente mais tarde
        </Alert>
      );
    }
    buttonInfo = (
      <Button variant="primary" type="submit">
        {buttonText}
      </Button>
    );
  }
  return (
    <Container>
      <Box className="contentBox">
        <div className="TitlePage">
          <Typography variant="h1" color="primary">
            {pageTitleText}
          </Typography>
        </div>
        <Formik
          initialValues={{
            firstName: parsedPerson.firstName,
            lastName: parsedPerson.lastName,
            jobTitle: parsedPerson.jobTitle,
            CPF: parsedPerson.CPF,
          }}
          validationSchema={signInSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            const { errors, setFieldValue, values } = formik;
            return (
              <Form>
                <TextField
                  required
                  id="outlined-required"
                  label="Primeiro Nome"
                  value={values.firstName}
                  onChange={(e) => setFieldValue("firstName", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="firstName"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="Sobrenome"
                  value={values.lastName}
                  onChange={(e) => setFieldValue("lastName", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="lastName"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="Profissão"
                  value={values.jobTitle}
                  onChange={(e) => setFieldValue("jobTitle", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="jobTitle"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="CPF"
                  value={values.CPF}
                  onChange={(e) => setFieldValue("CPF", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="CPF"
                />
                <p></p>
                {buttonInfo}
                {alertComp}
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
};