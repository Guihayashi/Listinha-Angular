import React, { useState } from 'react';
import '../css/login.css';
import {
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Button,
    Container,
    Row,
    
  } from 'reactstrap';

  function Login(args) {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggle = () => setIsOpen(!isOpen);
  
    return (
        <Form>
            <Row>
                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="EX: email@dominio.com"
                        type="email" />
                </FormGroup>
            </Row>
            <Row>
                <FormGroup>
                    <Label for="senha">
                        Senha
                    </Label>
                    <Input
                        id="senha"
                        name="senha"
                        placeholder="**************"
                        type="password" />
                </FormGroup>
            </Row>
            <Row>
                <Button classname='buttons' color='primary'>ENTRAR</Button>
            </Row>
            <Row>
                <Button classname='buttons' color='warning'>CADASTRAR-SE</Button>
            </Row>
        </Form>
    )}
export default Login;