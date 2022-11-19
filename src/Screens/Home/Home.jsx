import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Store/LoginContext";
import { useNavigate } from "react-router-dom";


import useAPI from "../../Services/APIs/Common/useAPI";
import Despesa from "../../Services/APIs/Despesas/Despesas";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

import './Home.css'


export default function Home() {    
    const context = useContext(LoginContext);
  
  const [cards, setCards] = useState([]);
  const [isConfirmRemoveDialogOpen, setIsConfirmRemoveDialogOpen] = useState(false)
  const [DespesaChose, setDespesaChose] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const getDespesaAPI = useAPI(Despesa.getDespesas);
  const deleteDespesaAPI = useAPI(Despesa.deleteDespesas);
  const navigate = useNavigate();

  const goToCadastro = (Despesa) => {
    navigate("/cadastro/" + Despesa.CPF, {
      state: {
        Despesa: JSON.stringify(Despesa)
      },
    });
  };

  const goToAdd = () => {
    navigate("/cadastro/-1", {
      state: {
        Despesa: "{}",
      },
    });
  };

  const makeLogOff = () => {
    context.onMakeLogoff();
  };

  const confirmRemoveDespesa = (Despesa) => {
    setIsConfirmRemoveDialogOpen(true);
    setDespesaChose(Despesa);
  };

  const deleteDespesa = (isConfirmed) => {
    setIsConfirmRemoveDialogOpen(false);
    if(!isConfirmed){      
      setDespesaChose(null)
    } else {
      setIsLoading(true)
      deleteDespesaAPI
        .requestPromise(DespesaChose._id)
        .then((info) => {
          console.log("Retornando Info");
          if(info.info.code === 1){
            setDespesaChose(null);
            setCards([]);
            getDespesasInfo();
          }  else {
            console.log(info);  
            setIsLoading(false);
            setDespesaChose(null);            
          }          
        })
        .catch((info) => {
          console.log(info);
          setIsLoading(false);
          setDespesaChose(null);
        });
    }
  };
  

  useEffect(() => {
    getDespesasInfo();
  }, []);

  const getDespesasInfo = () => {
    setIsLoading(true)
    getDespesaAPI
      .requestPromise()
      .then((info) => {
        let mountCards = [];
        info.Despesas.forEach((Despesa) => {
          setIsLoading(false);
          mountCards.push(
            <Grid key={Despesa._id} item lg={4} md={6} sm={12}>
              <Card className="cardBox">
                <CardMedia
                  component="img"
                  height="140"
                  image={Despesa.image}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {Despesa.nome} {Despesa.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Despesa.valor}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => goToCadastro(Despesa)}>Mais informações</Button>
                  <Button size="small" onClick={() => confirmRemoveDespesa(Despesa)}>Remover</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        });
        setCards(mountCards);
      })
      .catch((info) => {
        console.log(info);
      });
  };

  let info = null
  if(isLoading){
    info = (
      <div className="circularProgressClass">
        <CircularProgress color="secondary" />
      </div>
    );
  } else {
    info = <Grid container>{cards}</Grid>;
  }
  return (
    <Container>
      <div className="addButtonDiv">
        <Button onClick={() => makeLogOff()}>LogOff</Button>
      </div>
      <div className="TopPageTitle">
        <Typography variant="h1" color="primary">
          Despesas
        </Typography>
      </div>
      <div className="addButtonDiv">
        <Button variant="primary" onClick={() => goToAdd()}>
          Adicionar
        </Button>
      </div>
      {info}
      <Dialog
        open={isConfirmRemoveDialogOpen}
        onClose={() => confirmRemoveDespesa(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remover Despesa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente remover despesa{" "}
            {DespesaChose != null ? DespesaChose.nome : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteDespesa(false)}>Não</Button>
          <Button onClick={() => deleteDespesa(true)} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}