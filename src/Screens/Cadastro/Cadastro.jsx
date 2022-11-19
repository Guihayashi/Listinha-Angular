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
import Despesa from "../../Services/APIs/Despesas/Despesas";
import "./Cadastro.css"

export default function Cadastro() {

  const updateDespesaAPI = useAPI(Despesa.updateDaDespesa);
  const addDespesaAPI = useAPI(Despesa.createDespesas);
  const [isLoading, setIsLoading] = useState(false)
  const [connectCode, setConnectCode] = useState(0)

  const { infoID } = useParams();
  console.log(infoID);
  const {
    state: { Despesa },
  } = useLocation();

  const parsedDespesa = JSON.parse(Despesa);
  console.log(parsedDespesa);

  let navigate = useNavigate();

  const onBackButton = () => {
    navigate(-1);
  };

  const signInSchema = Yup.object().shape({
    nome: Yup.string()
      .required("Nome é obrigatório")
      .min(2, "O nome deve ter ao menos 2 caracteres"),
    categoria: Yup.string()
      .required("Categoria é obrigatório")
      .min(2, "A Categoria deve ter ao menos 2 caracteres"),
    status: Yup.string()
      .required("A profissão é obrigatório")
      .min(2, "A profissão deve ter ao menos 2 caracteres"),
    valor: Yup.number()
      .required("Valor é obrigatório"),
    dataDoVencimento: Yup.date()
      .required("Data é obrigatório"),
    descricao: Yup.string()
      .required("Descrição é obrigatório")
      .min(2, "A descrição deve ter ao menos 2 caracteres"),
  });

  const onSubmit = (values) => {
    console.log(values);
    let payload = {
        nome: values.nome,
        categoria: values.categoria,
        status: values.status,
        valor: values.valor,
        dataDoVencimento: values.dataDoVencimento,
        descricao: values.descricao,
    };

    setConnectCode(0);
    setIsLoading(true)    
    if(parseInt(infoID,10) === -1){
      addDespesaAPI
        .requestPromise(payload)
        .then(connectSuccess)
        .catch(connectError);
    } else {
      updateDespesaAPI
        .requestPromise(parsedDespesa._id, payload)
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

  let pageTitleText = "Alterar informação da despesa";
  let successConnectText = "Alteração realizada com sucesso!";
  let buttonText = "Alterar";
  if(parseInt(infoID,10) === -1){
    pageTitleText = "Adicionar nova despesa";
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
            nome: parsedDespesa.nome,
            categoria: parsedDespesa.categoria,
            status: parsedDespesa.status,
            valor: parsedDespesa.valor,
            dataDoVencimento: parsedDespesa.dataDoVencimento,
            descricao: parsedDespesa.descricao,
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
                  label="Categoria"
                  value={values.categoria}
                  onChange={(e) => setFieldValue("categoria", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="categoria"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="Valor"
                  value={values.valor}
                  onChange={(e) => setFieldValue("valor", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="valor"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="Status"
                  value={values.status}
                  onChange={(e) => setFieldValue("status", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="status"
                />
                <p></p>
                <TextField
                  required
                  id="outlined-required"
                  label="Data do Vencimento"
                  value={values.dataDoVencimento}
                  onChange={(e) => setFieldValue("dataVencimento", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="dataVencimento"
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Descrição"
                  value={values.descricao}
                  onChange={(e) => setFieldValue("descricao", e.target.value)}
                />
                <p></p>
                <ErrorMessage
                  component="div"
                  className="errorMessage"
                  name="descricao"
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