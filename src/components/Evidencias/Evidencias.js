import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { getEvidencesByUser } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import './evidencias.css';

let styleButton = {
  color:'white'
}

class Evidencias extends Component{

  state={
    evidencias:[],
    evidencia:{},
    open:false,
    marcasVentas:[]
  }
// el proposito de este compoNENTE ES MOSTRARLE AL USUARIO LAS EVIDENCIAS QUE HA MANDADO PARA QUE PUEDA OBSERVAR LO QUE 
// MANDO Y QUE SI AUN NO SE LE DAN SUS VENTAS O PUNTOS ES PORQUE LA EVIDENCIA QUE MANDO AUN ESTA PENDIENTE ES DECIR APROBANDOSE
// LO QUE HACEMOS ES TRAER TODAS LAS EVIDENCIAS QUE ESE USUARIO HA HECHO Y QUE ESTEN EN STATUS PENDIENTE 
  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getEvidencesByUser(id)
    .then(evidencias=>{
      for(let i = 0; i < evidencias.length; i++){
        evidencias[i].created = evidencias[i].created_at.slice(0,10)
        evidencias[i].dinamica = evidencias[i].dinamica.nombreDinamica
      }
      evidencias.sort((a, b) => new Date(b.created) - new Date(a.created))
      this.setState({evidencias})
    })
    .catch(e=>console.log(e))
   }
// ABRIR Y CERRAR DIALOGOS
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  // SE MANDA LA INFORMACIÓN DE LA EVIDENCIA A LA CUAL EL USUARIO HA HECHO CLICK
  oneMessage = (evidencia) => {
    let {marcasVentas} = this.state;
    marcasVentas = evidencia.marcas;
    this.setState({marcasVentas, evidencia})
    this.handleOpen()
  }
  // IR A EDITAR UNA EVIDENCIA
  goToEditEvidence=()=>{
    let {evidencia} = this.state;
    this.props.history.push(`/editevidence/${evidencia._id}`)
  }

  render(){
      const {evidencias,evidencia,marcasVentas} = this.state;
      const actions = [
        <FlatButton 
          onClick={this.goToEditEvidence}  
          label="Editar" 
          primary={true}
        />,
        <FlatButton 
        onClick={this.handleClose}  
        label="Cerrar" 
        primary={true}
      />
      ];
      return (
        <div>
        <TabSup />
        <div className="padreProfile">
          <div className="h5EnviarEvi">
            <FontIcon className="material-icons">device_unknown</FontIcon>
            <h4>Evidencias Pendientes</h4>
          </div> 
          <hr/>      
        </div>
        <div className="padreProfile">
          {evidencias.map((evidencia)=>(
            <div  key={evidencia._id}>
            <Paper>
              <h6>Esta es la evidencia que mandaste el <b>{evidencia.created}</b> para la dinámica <b>{evidencia.dinamica}</b></h6>
              <img alt="Imagen Evidencia" width="200" src={evidencia.archivo ? evidencia.archivo : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1" } />
              <br/>
              <br/>
              <FlatButton
                style={styleButton}
                label="Ver Detalles"
                backgroundColor="#546E7A"
                onClick={() => this.oneMessage(evidencia)}
                disableTouchRipple={true}
              />
            </Paper>
            <hr/>
            </div>
          ))} 
          <div>
          <Dialog
          title="Detalle de evidencia: "
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="padreProfile"
        > 
          <h5 className="evidenciaStatus">{evidencia.status}</h5>
          <h6>Mensaje: </h6>
          <span>{evidencia.mensaje ? evidencia.mensaje : "No enviaste mensaje"}</span>
          <br/>
          <span className="fechaEvidenciaRechazada">{"Enviaste esta evidencia el "+evidencia.created}</span>
          <hr/>
          <h6 >Ventas: </h6> {marcasVentas.map((marca,index)=>(
                <div className="ventas" key={index}>
               
                <Chip
                className="dinamicDetailHijo"
                >
                <Avatar src={marca._id.imagen} />
                  <span>{marca._id.nombre.length > 18 ?  marca._id.nombre.slice(0,16) + "... " : marca._id.nombre}</span><b>{" "+marca.ventas + " ventas" }</b>
                </Chip>
                <br/> 
                </div>
              ))}
              <br/><br/>
          <img alt="imagen archivo" width="230" height="200" src={evidencia.archivo ? evidencia.archivo : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1"}/>
        </Dialog>
          </div>
          </div>
        </div>
      );
    }
    
  }
  

export default Evidencias;
