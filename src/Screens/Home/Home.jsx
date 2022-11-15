import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Store/LoginContext";
import { useNavigate } from "react-router-dom";


import useAPI from "../../Services/APIs/Common/useAPI";
import Person from "../../Services/APIs/Persons/Persons";
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
  const [personChose, setPersonChose] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const getPersonAPI = useAPI(Person.getPersons);
  const deletePersonAPI = useAPI(Person.deletePersons);
  const navigate = useNavigate();

  const goToDetail = (person) => {
    navigate("/detail/" + person.CPF, {
      state: {
        person: JSON.stringify(person)
      },
    });
  };

  const goToAdd = () => {
    navigate("/detail/-1", {
      state: {
        person: "{}",
      },
    });
  };

  const makeLogOff = () => {
    context.onMakeLogoff();
  };

  const confirmRemovePerson = (person) => {
    setIsConfirmRemoveDialogOpen(true);
    setPersonChose(person);
  };

  const deletePerson = (isConfirmed) => {
    setIsConfirmRemoveDialogOpen(false);
    if(!isConfirmed){      
      setPersonChose(null)
    } else {
      setIsLoading(true)
      deletePersonAPI
        .requestPromise(personChose._id)
        .then((info) => {
          console.log("Retornando Info");
          if(info.info.code === 1){
            setPersonChose(null);
            setCards([]);
            getPersonsInfo();
          }  else {
            console.log(info);  
            setIsLoading(false);
            setPersonChose(null);            
          }          
        })
        .catch((info) => {
          console.log(info);
          setIsLoading(false);
          setPersonChose(null);
        });
    }
  };
  

  useEffect(() => {
    getPersonsInfo();
  }, []);

  const getPersonsInfo = () => {
    setIsLoading(true)
    getPersonAPI
      .requestPromise()
      .then((info) => {
        let mountCards = [];
        info.persons.forEach((person) => {
          setIsLoading(false);
          mountCards.push(
            <Grid key={person._id} item lg={4} md={6} sm={12}>
              <Card className="cardBox">
                <CardMedia
                  component="img"
                  height="140"
                  image={person.image}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {person.firstName} {person.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {person.jobTitle}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => goToDetail(person)}>Mais informações</Button>
                  <Button size="small" onClick={() => confirmRemovePerson(person)}>Remover</Button>
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
        onClose={() => confirmRemovePerson(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remover Pessoa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente remover o usuário{" "}
            {personChose != null ? personChose.firstName : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deletePerson(false)}>Não</Button>
          <Button onClick={() => deletePerson(true)} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}