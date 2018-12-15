import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { getEvidencesDesapByUser,deleteEvidence } from '../../services/evidencias';
import './evidencias.css';


let styleButton = {
  color:'white'
}
const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

class EviRech extends Component{

  state={
    evidencias:[],
    puntos:[],
    open:false,
    evidencia:{}
  }

// ESTE COMPONENTE LE MUESTRA AL USUARIO LAS EVIDENCIAS "RECHAZADAS O DESAPROBADAS" QUE TIENE, PARA QUE PUEDA EDITARLAS O BORRARLAS.
  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getEvidencesDesapByUser(id)
    .then(evidencias=>{
      for(let i = 0; i < evidencias.length; i++){
        evidencias[i].din = evidencias[i].dinamica.nombreDinamica
        evidencias[i].pic = evidencias[i].dinamica.imagenPremio
        evidencias[i].pic2 = evidencias[i].archivo
        evidencias[i].idd = evidencias[i].dinamica._id
        evidencias[i].created = evidencias[i].created_at.slice(0,10)        
      }
      evidencias.sort((a, b) => new Date(b.created) - new Date(a.created))
      this.setState({evidencias})
    })
    .catch(e=>console.log(e))
 }

 // ABRIR Y CERRAR DIALOGOS INFORMATIVOS
handleOpen = () => {
  this.setState({open: true});
};
handleClose = () => {
  this.setState({open: false});
};

// ABRIR UNA EVIDENCIA EN ESPECIFICO CUANDO SE LE DA CLIC A VER
oneMessage = (evidencia) => {
  this.setState({evidencia})
  this.handleOpen()
};

// BORRAR UNA EVIDENCIA
deleteEvidence =()=>{
  let {evidencia} = this.state;
  deleteEvidence(evidencia._id)
  .then(evidencia=>{
    window.location.reload()
  })
  .catch(e=>console.log(e))
}

  // IR A EDITAR UNA EVIDENCIA
  goToEditEvidence=()=>{
    let {evidencia} = this.state;
    this.props.history.push(`/editevidence/${evidencia._id}`)
  }

  render(){
    const {evidencias,evidencia} = this.state;
    const actions = [
      <FlatButton 
      onClick={this.goToEditEvidence}  
      label="Editar" 
      primary={true}
    />,
    <FlatButton 
    onClick={this.deleteEvidence}  
    label="Borrar" 
    primary={true}
    />,
    <FlatButton 
    onClick={this.handleClose}  
    label="Cerrar" 
    primary={true}
  />
    ]
      return (
        <div>
          <div>
          <TabSup/>
          </div>
          <div className="padreProfile">
          <div className="h5EnviarEvi">
          <FontIcon className="material-icons">sentiment_very_dissatisfied</FontIcon>
          <h4>Evidencias Rechazadas</h4>
          </div>
          <hr/>
          {evidencias.map((evidencia)=>(
            <div  key={evidencia._id}>
            <Paper>
              <h6>Se ha rechazado una de tus evidencias</h6>
              <img alt="Imagen Nota" width="150" src={evidencia.pic ? evidencia.pic : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1" } />
              <br/>
              <FlatButton
                style={styleButton}
                label="Ver"
                backgroundColor="#546E7A"
                onClick={() => this.oneMessage(evidencia)}
                disableTouchRipple={true}
              />
            </Paper>
            <hr/>
            </div>
              
          ))} 
          </div>
          <div>
          <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="padreProfile"
          actions={actions}
          contentStyle={customContentStyle}

        > 
          <h6>{"Evidencia rechazada de la dinámica " + evidencia.din}</h6>
          <hr/>
          <b>Mensaje: </b>
          <span>{evidencia.nota}</span>
          <br/>
          <img alt="Imagen Nota" width="230" height="200" src={evidencia.pic2 ? evidencia.pic2 : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1"}/>
          <br/>
          <span className="fechaEvidenciaRechazada">{evidencia.created}</span>
        </Dialog>
          </div>

        </div>
      );
    }
    
  }
  

export default EviRech;
