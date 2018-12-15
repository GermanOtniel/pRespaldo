import React, {Component} from 'react';
import {getSingleUser} from '../../services/auth';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';





class Habilities extends Component{

  state={
    user: {},
    colaborativo:[],
    disciplinado:[],
    puntualidad:[],
    limpieza:[],
    open:false
  }

  // ESTE COMPONENTE MUESTRA LAS HABILIDADES DE UN USUARIO EN SI
  // PARA ESO TRAEMOS AL USUARIO Y GUARDAMOS SUS DISTINTAS HABILIDADES EN STATE 
  // COMO REPRESENTAMOS LA CANTIDAD DE CIERTA HABILIDAD POR MEDIO DE ESTRELLAS PUES PUSHEAMOS A UN ARRAY LA PALABRA STAR EL NUMERO QUE 
  // TENGA ESA HABILIDAD, ES DECIR SI UN USUARIO TIENE 3 EN LA CALIFICACION PROMEDIO DE LIMPIEZA, SE PUSHEA 3 VECES LA PALABRA STAR PARA QUE LE SALGAN 3 ESTRELLITAS
  // EASY PEASY
 componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
   getSingleUser(id)
   .then(user=>{
     let {colaborativo,disciplinado,puntualidad,limpieza,open} = this.state;
     let colaborativoNumber,disciplinadoNumber,puntualidadNumber,limpiezaNumber;
     let arrHabilities = user.habilidades
     let sumaColaborativo = 0
     let sumaLimpieza = 0
     let sumaPuntualidad = 0 
     let sumaDisciplinado = 0
     let lengthArrHab = arrHabilities.length;
     for(let j = 0; j < arrHabilities.length; j++){
       sumaColaborativo = sumaColaborativo + arrHabilities[j].colaborativo
       sumaLimpieza     = sumaLimpieza + arrHabilities[j].limpieza
       sumaDisciplinado = sumaDisciplinado + arrHabilities[j].disciplinado
       sumaPuntualidad  = sumaPuntualidad + arrHabilities[j].puntualidad
     }
     colaborativoNumber = Math.round(sumaColaborativo / lengthArrHab);
     disciplinadoNumber = Math.round(sumaDisciplinado / lengthArrHab);
     puntualidadNumber = Math.round(sumaPuntualidad / lengthArrHab);
     limpiezaNumber = Math.round(sumaLimpieza / lengthArrHab);
     if(colaborativoNumber > 0){
       for(let i = 0; i < colaborativoNumber; i++){
         colaborativo.push('star')
       }
     }
     if(disciplinadoNumber > 0){
      for(let i = 0; i < disciplinadoNumber; i++){
        disciplinado.push('star')
      }
    }
    if(puntualidadNumber > 0){
      for(let i = 0; i < puntualidadNumber; i++){
        puntualidad.push('star')
      }
    }
    if(limpiezaNumber > 0){
      for(let i = 0; i < limpiezaNumber; i++){
        limpieza.push('star')
      }
    }
    if(colaborativoNumber === 0 && disciplinadoNumber === 0 && puntualidadNumber === 0 && limpiezaNumber === 0){
      open = true
    }
    this.setState({user,colaborativo,disciplinado,puntualidad,limpieza,open})
   })
   .catch(e=>console.log(e));
 }

 goToProfile=()=>{
   let {user} = this.state;
   this.props.history.push(`/profile/${user._id}`)
 }


  render(){
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.goToProfile}
      />
    ]
    const {open,colaborativo,puntualidad,disciplinado,limpieza} =this.state;
      return (
        <div className="padreProfile">
        <TabSup />
        <div className="padreProfile">
          <div className="h5EnviarEvi">
            <FontIcon className="material-icons">insert_chart_outlined</FontIcon>
            <h4>Mis Habilidades</h4>
          </div> 
          <hr/>      
        </div>
        <div>
          <h5>Colaborativo: </h5><br/>{colaborativo.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
          <Divider/><br/>
          <h5>Disciplinado: </h5><br/> {disciplinado.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
          <Divider/><br/>
          <h5>Puntualidad: </h5><br/>{puntualidad.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
          <Divider/>
          <h5>Limpieza: </h5><br/>{limpieza.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
          <Divider/><br/>
        </div>
        <div>
        <Dialog
          title="Información:"
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          actions={actions}
        >
          <div className="padreProfile">
            Aún no se han calificado tus habilidades.
          </div>      
        </Dialog> 
        </div>
        </div>
      );
    }
    
  }
  

export default Habilities;
