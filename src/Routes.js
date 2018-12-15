import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Login from './components/Login/Login';
import Dinamica from './components/Dinamicas/Dinamicas';
import DinamicDetail from './components/Dinamicas/DinamicDetail';
import EviRech from './components/Evidencias/EviRech';
import Ventas from './components/Ventas/Ventas';
import Evidencias from './components/Evidencias/Evidencias';
import SendEvidence from './components/Dinamicas/SendEvidence';
import EditEvidence from './components/Evidencias/EditEvidence';
import Habilities from './components/Habilities/Habilities';
import Documentos from './components/Documentos/Documentos';
import Mensajes from './components/Mensajes/Mensajes';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/edit/:id" component={EditProfile}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/dinamicas" component={Dinamica}/>
      <Route path="/dinamica/:id" component={DinamicDetail}/>
      <Route path="/sendevi/:id" component={SendEvidence}/>
      <Route path="/evirech" component={EviRech}/>
      <Route path="/ventas" component={Ventas}/>
      <Route path="/evidencias" component={Evidencias}/>
      <Route path="/habilities" component={Habilities}/>
      <Route path="/documents" component={Documentos}/>
      <Route path="/mensajes" component={Mensajes}/>
      <Route path="/editevidence/:id" component={EditEvidence}/>
    </Switch>
  );
}