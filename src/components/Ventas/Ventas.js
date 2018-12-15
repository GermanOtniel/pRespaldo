import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import { getVentas } from '../../services/ventas';
import { sendWinner } from '../../services/dinamicas';
import Chip from 'material-ui/Chip';
import './ventas.css';


const style2 = {
  margin: 5,
  float: 'right'
};


class Ventas extends Component{

  state={
    ventas:[],
    newArray:[],
    open: false,
    algo: true
  }

  // TRAEMOS TODAS LAS VENTAS QUE ESTE USUARIO A PRODUCIDO
  // Y LAS VAMOS ACOMODANDO, SACAMOS LAS DINAMICAS A LAS CUALES PERTENECEN ESTAS VENTAS, DEJAMOS DINAMICAS NO REPETIDAS...
  // Y SE VA EXPLICANDO MAS A DETALLE DENTRO DE LAS FUNCIONES
  componentWillMount(){
    const user = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getVentas(user)
    .then(ventas=>{
      let {algo} = this.state;
//DINAMICAS EN LAS QUE EL USUARIO TIENE VENTAS APROBADAS 
      let dinamicasArray = ventas.map(venta=>venta.dinamica);
// DONDE VOY A GUARDAR LAS DINAMICAS QUE YA NO SE REPITEN
      var {newArray} = this.state;
      // NO SE QUE HACE PERO ES NECESARIO
      var lookupObject  = {};
// EL CICLO QUE RECORRE EL ARRAY ORIGINAL DE DINAMICAS EN LA CUAL AUN HAY REPETIDAS
      for(var i in dinamicasArray) {
        lookupObject[dinamicasArray[i]['_id']] = dinamicasArray[i];
      }
// EL CICLO QUE PUSHEA AL OBJETO DONDE SE GUARDAN LAS DINAMICAS NO REPETIDAS
      for(i in lookupObject) {
         newArray.push(lookupObject[i]);
      }    
// HASTA AQUI newArray LLEVA TODAS LAS DINAMICAS UNICAS, ES DECIR YA 
//NO HAY DINAMICAS REPETIDAS.
//AHORA LOS SIGUIENTES 3 CICLOS HACEN:
// 1) RECOORE EL ARRAY DE DINAMICAS UNICAS
// 2) RECORRE ELARRAY DE VENTAS
// 3) COMPARA LOS IDs DE LAS DINAMICAS CON LOS IDS DE A QUE DINAMICA PERTENECEN LAS VENTAS
// SI ALGUN ID COINCIDE ESA VENTA SE INSERTA A ESA DINAMICA
      for(var x = 0; x<newArray.length;x++){
        for(var j = 0; j<ventas.length;j++){
          if( newArray[x]._id === ventas[j].dinamica._id ){
            for(let k = 0; k < ventas[j].marcas.length; k++){
              newArray[x].ventas.push(ventas[j].marcas[k])
            }
          }
        }
      }
// HASTA AQUI newArray YA LLEVA LAS DINAMICAS UNICAS EXISTENTES Y CADA DINAMICA
// LLEVA LAS VENTAS QUE LE CORRESPONDEN

// AHORA VIENE SACAR LOS TOTALES DE VENTAS DE CADA DINAMICA.
// 1) RECORREMOS EL ARRAY DE DINAMICAS UNICAS
// 2) CUANDO ESTAMOS DENTRO DE CADA DINAMICA, RECORREMOS EL ARRAY DE marcaPuntosVentas
//EN DONDE ESTAN LAS MARCAS PARTICIPANTES DE ESA DINAMICA JUNTO CON LAS METAS DE VENTA DE CADA PRODUCTO
// 3) DESPUES RECORREMOS EL ARRAY DE ventas LOGRADAS POR EL USUARIO Y HACEMOS LA COMPARACION NUEVAMENTE,
// ESTA COMPARACION LA HACEMOS POR EL ID DE LA MARCA, SI ESTE COINCIDE SUMALE LAS VENTAS
// Y PONLE NOMBRE TAMBIEN A ESA MARCA
      for(let f = 0; f < newArray.length; f++){
        for( let b = 0; b < newArray[f].marcaPuntosVentas.length; b++){
          for(let n = 0; n < newArray[f].ventas.length; n++){
            if(newArray[f].marcaPuntosVentas[b]._id === newArray[f].ventas[n]._id._id){
              newArray[f].marcaPuntosVentas[b].puntosUsuario += newArray[f].ventas[n].ventas
              newArray[f].marcaPuntosVentas[b].nombre = newArray[f].ventas[n]._id.nombre
              newArray[f].marcaPuntosVentas[b].foto = newArray[f].ventas[n]._id.imagen
              algo = false
            }
            // PARA HABILITAR EL BOTON DE RECLAMAR PREMIO NECESITAMOS VERIFICAR QUE LAS VENTAS QUE HA REALIZADO UN USUARIO 
            // DE UNA MARCA CUMPLAN CON LA META DE VENTAS PARA ESA MARCA, ES POR ESO QUE NOS ADENTRAMOS EN CADA MARCA, 
            // VERIFICAMOS SI LAS VENTAS HECHAS POR EL USUARIO SON IGUAL O MAYOR A LA META DE VENTAS PARA ESA MARCA
            // SI SI ES IGUAL O MAYOR AGREGA UN ATRIBUTO A ESA MARCA LLAMADO META Y LO CAMBIA A TRUE
            if(newArray[f].marcaPuntosVentas[b].puntosUsuario >= newArray[f].marcaPuntosVentas[b].puntosVentas){
              newArray[f].marcaPuntosVentas[b].meta = true
            }
            // SI LA META ES MAYOR A LAS VENTAS EL ATRIBUTO META ES FALSE
            else if(newArray[f].marcaPuntosVentas[b].puntosUsuario < newArray[f].marcaPuntosVentas[b].puntosVentas){
              newArray[f].marcaPuntosVentas[b].meta = false
            }
          }
          // DESPUES VEMOS CUANTOS TRUE HAY EN LAS MARCAS, SI LA CANTIDAD DE TRUES ES IGUAL A LA CANTIDAD DE MARCAS
          // SIGNIFICA QUE TODAS LAS MARCAS HAN CUMPLIDO CON SU META DE VENTAS, LO CUAL SIGNIFICA QUE TENEMOS QUE ACTIVAR EL BOTON DE 
          // RECLAMAR PREMIO
          if(newArray[f].marcaPuntosVentas[b].meta === true){
            newArray[f].ventasTotales += 1
            if(newArray[f].ventasTotales  === newArray[f].marcaPuntosVentas.length ) newArray[f].ganador = true;
          }
        }
      }
// HASTA AQUI newArray LLEVA LAS DINAMICAS UNICAS JUNTO CON LAS VENTAS QUE LE 
//CORRESPONDE A CADA UNA Y TAMBIEN YA VAN SUMADAS ESAS VENTAS POR PRODUCTO.
      this.setState({newArray,algo})
    })
    .catch(e=>console.log(e))
  }
  // ABRE Y CIERRA DIALOGOS DE INFORMACION
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
    this.props.history.push("/dinamicas");
  };

  // FUNCION QUE PERMITE AL USUARIO HACERSE UN GANADOR DE LA DINAMICA, ESTE BOTON Y ESTA FUNCION SOLO DEBERIA DE VERSE CUANDO UN 
  // USUARIO HA LOGRADO LAS METAS DE VENTAS DE LA DINAMICA CORRESPONDIENTE
  oneWinner = (dinamic) => {
    let idDinamica = dinamic._id;
    dinamic.winner = `${JSON.parse(localStorage.getItem('user'))._id}`;
    sendWinner(dinamic,idDinamica)
    .then(dinamic=>{
      this.setState({open:true})
    })
    .catch(e=>console.log(e))
  } 

  render(){
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    const { newArray,algo } = this.state;
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div style={!algo ? {display:"none"} :  {display:"block"}}>
          <div className="noVentas">
          <h3>Aún no tienes ventas...</h3>
          <h3>¡Vamos, participa en una dinámica!</h3>
          </div>
          </div>
          {/* <div>
          {newArray.map((dinamic)=>(
            <div key={dinamic._id} className="bloques">
              <hr className="hrVentas"/>
              <h4>Dinamica: {dinamic.nombreDinamica}</h4>
              <h6>Puntaje: </h6> {dinamic.marcaPuntosVentas.sort((a, b) => b.puntosUsuario - a.puntosUsuario ).map((marca)=>(
                <div className="ventas" key={marca._id}>
                <p>Marca: {marca.nombre}</p>  <span>Meta de Ventas:</span> <big>{marca.puntosVentas}</big><br/>
                <b>Ventas Logradas: {marca.puntosUsuario}</b>
                {marca.puntosUsuario >= marca.puntosVentas ? dinamic.ganador = true : dinamic.ganador = false}
                </div>
              ))}
              <div className="buttonVentas">
              <button style={dinamic.ganador === true ? {display:"block"} : {display:"none"} } onClick={() => this.oneWinner(dinamic)}>Reclamar premio</button>
              </div>
          </div>
          ))} 
          </div> */}



          <div>
          {newArray.map((dinamic)=>(
             <div key={dinamic._id}>
               <Avatar
                src={dinamic.imagenPremio}
                size={90}
                style={style2}
              />
              <b>Nombre de la Dinámica:</b>
              <h4>{dinamic.nombreDinamica}</h4>
              <h6 className="ache6">Ventas: </h6> {dinamic.marcaPuntosVentas.sort((a, b) => b.puntosUsuario - a.puntosUsuario ).map((marca,index)=>(
                <div className="ventas" key={index}>
                <hr/>
                <Chip
                className="dinamicDetailHijo"
                >
                <Avatar src={marca.foto} />
                  {marca.nombre}
                </Chip>
                <br/> 
                <br/> 
                <p>Meta de Ventas: <big>{marca.puntosVentas}</big> </p>
                <p>Ventas Logradas: <big className="bigVentas">{marca.puntosUsuario}</big> </p>
                <hr/>
                </div>
              ))}
              <hr className="hrVentas"/>
              <div className="buttonVentas">
              <button style={dinamic.ganador === true ? {display:"block"} : {display:"none"} } onClick={() => this.oneWinner(dinamic)}>Reclamar premio</button>
              </div>
             </div>
          ))} 
          </div>
          

          <div>
          <Dialog
          title="¡GANASTE!"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          ¡¡¡Felicidades!!! Eres un GANADOR de esta dinámica, en breve se comunicaran contigo via 
          correo electrónico para la entrega de tu PREMIO.
        </Dialog>
          </div>
          

          
        </div>
      );
    }
    
  }
  

export default Ventas;
