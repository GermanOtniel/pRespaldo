import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { getNotas,deleteNote } from '../../services/notas';
import './notas.css';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
  },
};

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

class Mensajes extends Component{

  state={
    open:false,
    mensajes:[],
    mensaje:{}
  }

  // COMPONENTE PARA TRAER LOS MENSAJES QUE CORRESPONDEN A ESPECIFICO USUARIO
  // TRAEMOS LAS NOTAS QUE CORRESPONDAN A ESTE USUARIO Y ACOMODAMOS RESPECTIVOS DATOS PARA UNA MEJOR REPRESENTACION 
   componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getNotas(id)
    .then(mensajes=>{
        for(let i = 0; i < mensajes.length; i++){
          mensajes[i].created = mensajes[i].created_at.slice(0,10)
          mensajes[i].remite = mensajes[i].remitente.correo
          mensajes[i].remiteBrand = mensajes[i].remitenteOtro.nombre
        }
      this.setState({mensajes})
    })
    .catch(e=>console.log)
 }

 // ABRIR Y CERRAR DIALOGOS INFORMATIVOS
handleOpen = () => {
  this.setState({open: true});
};
handleClose = () => {
  this.setState({open: false});
};
// PARA VER CIERTO MENSAJE EN ESPECIFICO
mensaje=(m)=>{
  this.setState({open:true,mensaje:m})
}
// BORRAR MENSAJE, EN SI NO SE BORRA SOLO SE QUITA EL ID DE ESTE USUARIO DE ESE MENSAJE PARA QUE YA NO TRAIGA ESE MENSAJE, 
// PERO EL MENSAJE EN SI SIGUE EXISITIENDO HASTA QUE EL USUARIO DASHBOARD DECIDA BORRARLO
deleteMessage=()=>{
  let {mensaje} = this.state;
  let id = `${JSON.parse(localStorage.getItem('user'))._id}`;
  let body = {
    idUser:id
  }
  deleteNote(mensaje._id,body)
  .then(r=>{
    window.location.reload()
  })
  .catch(e=>console.log(e))
}

  render(){
    const actions = [
      <FlatButton 
        onClick={this.deleteMessage}  
        label="Borrar" 
        primary={true}
      />,
      <FlatButton 
        onClick={this.handleClose}  
        label="Cerrar" 
        primary={true}
      />
    ]
    const {mensajes,mensaje} = this.state;
      return (
        <div>
          <div>
            <TabSup />
          </div>
          <div className="padreProfile">
            <div className="h5EnviarEvi">
              <FontIcon className="material-icons">mail_outline</FontIcon>
              <h4>Mensajes:</h4>
            </div>
            <hr/>
          </div>
          <div style={styles.root}>
            <GridList
              cellHeight={180}
              style={styles.gridList}
            >
              {mensajes.sort((a, b) => new Date(b.created) - new Date(a.created)).map((mensaje) => (
              <GridTile
                onClick={()=>this.mensaje(mensaje)}
                key={mensaje._id}
                title={mensaje.remiteBrand}
                subtitle={mensaje.created}
              >
                <img alt="Imagen Premio Dinámica" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fmensaje.jpg?alt=media&token=043fdf2b-ab64-4d7d-956c-feb7ab49a9cb"/>
              </GridTile>
              ))}
            </GridList>
          </div>
          <div>
            <Dialog
              modal={false}
              title={'Asunto: ' + mensaje.asunto}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
              className="padreProfile"
              actions={actions}
              contentStyle={customContentStyle}
            > 
              <p style={{fontSize:'14px'}}>{'Remitente: ' + mensaje.remiteBrand}</p>
              <p style={{fontSize:'18px'}}>{"Mensaje: " + mensaje.cuerpo}</p>
              <b>{mensaje.created}</b>
            </Dialog>
          </div>
        </div>
      );
    }
    
  }
  
export default Mensajes;
