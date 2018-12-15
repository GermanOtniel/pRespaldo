import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Link} from 'react-router-dom';
import { getDinamics } from '../../services/dinamicas';
import { Mixpanel } from '../../mixpanel/mixpanel';


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

class Dinamica extends Component{

  state={
   dinamics:[],
   centro:false,
   open:true,
   dinamicas:false
  }

  // SE REVISA SI EL USUARIO CUENTA CON UN CENTRO DE CONSUMO YA SELECCIONADO
  // SI YA TIENE UN CENTRO DE CONSUMO SE MANDA EL ID DEL CENTRO D ECONSUMO 
  // PARA QUE NOS TRAIGA LAS DINAMICAS QUE CORRESPONDEN A SU CENTRO DE CONSUMO
  // SINO TIENE UN CENTRO DE CONSUMO SELECCIONADO PUES SE LE DICE QUE DEBE DE HACER.
  // EN DADO CASO QUE YA HAYA SELECCIONADO UN CENTRO DE CONSUMO PERO NO HAYA DINAMICAS PARA SU CENTRO DE CONSUMO 
  // TAMBIEN S ELE DICE QUE SUCEDE
  componentWillMount(){
    let {centro} = this.state;
    let {dinamicas} = this.state;
    let userCentro = `${JSON.parse(localStorage.getItem('user')).centroConsumo}`;
    let userCenter;
    if( userCentro === "undefined" ) {
      userCenter = "No hay centro"
      centro = true
      this.setState({centro})
    }
    else if (userCentro !== "undefined"){
      userCenter = userCentro
      centro = false
      getDinamics(userCenter)
      .then(dinamics=>{
        if(dinamics.length > 0){
          dinamicas = false
        }
        else if(dinamics.length === 0){
          dinamicas = true
        }
        this.setState({dinamics,centro,dinamicas})
      })
      .catch(e=>console.log(e))
    }  
 }

 // ESTAS FUNCIONES ABREN Y CIERRAN DIALOGOS INFORMATIVOS
 handleClose = () => {
  this.setState({centro: false});
 };
 handleClose2 = () => {
  this.setState({dinamicas: false});
 };

 //ESTA FUNCION NOS LLEVA A UNA DINAMICA EN ESPECIAL Y MANDAMOS SU ID MEDIANTE LOS PARAMS
 dinamic=(dinamic)=>{
    this.props.history.push(`/dinamica/${dinamic._id}`);
    Mixpanel.track('Click dinamic',{
      "nombre": dinamic.nombreDinamica,
      "$id":dinamic._id
    })
 }

 // CUANDO NO HAY DINAMICAS O CENTRO DE CONSUMO EL BOTON QUE SE HABILITA EN EL DIALOGO INFORMATIVO LLEVA AL USUARIO A SU PERFIL
 outOfDinamics=()=>{
  this.props.history.push(`/profile/${JSON.parse(localStorage.getItem('user'))._id}`);
 }
  render(){
    const {dinamics,centro} = this.state;
    const actions = [
      <FlatButton
        label="Ir a mi Perfil"
        primary={true}
        keyboardFocused={true}
        onClick={this.outOfDinamics}
      />,
    ];
    const actions2 = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.outOfDinamics}
      />,
    ];
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div>
          <Dialog
          title="¡Actualiza tu Perfil!"
          actions={actions}
          modal={false}
          open={centro}
          onRequestClose={this.handleClose}
        >
          Para saber que Dinámicas corresponden a tu Centro de Consumo necesitamos saber en que Centro de Consumo trabajas,
          por favor regresa a tu Perfil y actualízalo.
          <br/><br/>
          <b>Una vez que lo hayas hecho sal de la aplicación y vuelve a <big>Ingresar</big> con tu correo y contraseña o en su defecto con tu cuenta de 
          Google.</b>
        </Dialog>
          </div> 
          <div>
          <Dialog
          title="¡Qué triste!"
          modal={false}
          actions={actions2}
          open={this.state.dinamicas}
          onRequestClose={this.handleClose2}
        >
          Lo lamentamos aún no hay Dinámicas existentes en tu Centro de Consumo.
          <br/><br/>
          <b>Pero no te preocupes esto no suele pasar muy seguido y seguro pronto habra dinámicas, ¡regresa pronto!</b>
        </Dialog>
          </div>
        <div style={styles.root}>
          <GridList
      cellHeight={180}
      style={styles.gridList}
    >
      {dinamics.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)).map((dinamic) => (
      
          <GridTile
          onClick={()=>this.dinamic(dinamic)}
          key={dinamic.imagenPremio}
          title={dinamic.nombreDinamica}
          subtitle={<b>{dinamic.fechaInicio.slice(0,10)} <br/>Modalidad:  {dinamic.modalidad}</b>}
          actionIcon={<Link to={`/dinamica/${dinamic._id}`} ><IconButton><FontIcon color="white" className="material-icons">pageview</FontIcon></IconButton></Link>}
        >
          <img alt="Imagen Premio Dinámica" src={dinamic.imagenPremio} />
        </GridTile>
       
      ))}
    </GridList>
        </div>
          
        </div>
      );
    }
    
  }
  

export default Dinamica;
