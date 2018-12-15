import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import firebase from '../../firebase/firebase';
import { getSingleEvidence,editEvidence } from '../../services/evidencias';
import TextField from 'material-ui/TextField';
import TabSup from '../Profile/TabSup';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import {green700} from 'material-ui/styles/colors';
import './evidencias.css';

const styles2 = {
  chip: {
    margin: 4,
  },
  errorStyle: {
    color: green700,
  },
  underline:{
    width: '75%'
  }
};
const styles = {
  uploadButton: {
    verticalAlign: 'middle',
    color:"#FAFAFA"
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


// COMPONENTE PARA EDITAR UNA EVIDENCIA, SE USA TANTO PARA CUANDO UNA EVIDENCIA ESTA PENDIENTE  O YA HA SIDO RECHAZADA

class EditEvidence extends Component{

  state={
    evidence:{},
    marcas:[],
    imagen:"",
    dinamica:{},
    boton:true,
    open:false,
    open2:false,
    mensaje:""
  }

  //TRAEMOS LA EVIDENCIA, SEPARAMOS SUS MARCAS, SU IMAGEN, LA DINAMICA A LA QUE PERTENECE Y EL MENSAJE QUE TRAE SI ES QUE TRAE MENSAJE
  componentWillMount(){
    let id = this.props.match.params.id;
    getSingleEvidence(id)
    .then(evidencia=>{
      this.setState({evidence:evidencia,marcas:evidencia.marcas,imagen:evidencia.archivo,dinamica:evidencia.dinamica,mensaje:evidencia.mensaje})
    })
    .catch(e=>console.log(e))
  }
// ABRIR Y CERRAR DIALOGOS
  handleOpen=()=>{
    this.setState({open:true})
  }
  handleClose=()=>{
    this.setState({open:false})
  }
  handleOpen2=()=>{
    this.setState({open2:true})
  }
  handleClose2=()=>{
    this.setState({open2:false})
  }
// ESTA FUNCION GUARDA LAS FOTOS DE LAS EVIDENCIAS EN FIREBASE STORAGE E 
// INSERTA EL LINK DE LA IMAGEN EN LOS DATOS QUE SE ENVIARAN COMO EVIDENCIA.
getFile = e => {
  let {dinamica} = this.state;
  const file = e.target.files[0];
  const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
  const date = new Date();
  const date2 = String(date).slice(4,24)
  const numberRandom = Math.random();
  const number = String(numberRandom).slice(2,16)
  const child = 'evidenceOf'+correo + date2 + number
  const carpet = "evidenciasOrdenadas/" + dinamica.nombreDinamica
  //aqui lo declaro
  const uploadTask = firebase.storage()
  .ref(carpet)
  .child(child)
  .put(file);
  //aqui agreggo el exito y el error
  uploadTask
  .then(r=>{
    r.ref.getDownloadURL()
    .then(url=>{
      const {evidence} = this.state;
      evidence.archivo =  url;
      this.setState({evidence,boton:false,imagen:url})
    })
    .catch(e=>console.log(e))
  })
  .catch(e=>console.log(e)) //task
  uploadTask.on('state_changed', (snap)=>{
    const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
    if(progresoImagen === 0 ){
      this.handleOpen()
    }
    else if(progresoImagen === 100){
      this.handleClose();
    }
  })
 };
// GUARDA LAS CANTIDADES QUE SE EDITAN, SI ES QUE SE EDITAN, EN LA NUEVA EVIDENCIA QUE SE MANDARA
  onChangeEvidence=(e)=>{
    const field = e.target.name;
    const value = e.target.value;
    const {marcas,evidence} = this.state;
    for(let i = 0; i<marcas.length;i++){
      if(field === marcas[i]._id._id){
        marcas[i].ventas = value
      }

    }
    evidence.marcas = marcas;
    this.setState({marcas,evidence,boton:false})
  }

  // GUARDA EL MENSAJE OPCIONAL, E SO UNICO QUE GUARDA ESTE ONCHANGE
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidence} = this.state;
    evidence[field] = value;
    this.setState({evidence,boton:false}); 
  }

  // SE ENVIA LA EVIDENCIA O LOS CAMBIOS DE LA EVIDENCIA 
  sendChanges=()=>{
    let {evidence}=this.state;
    evidence.status = "Pendiente"
    for(let i=0;i<evidence.marcas.length;i++){
      if(evidence.marcas[i].ventas === "" || evidence.marcas[i].ventas === null ){
        evidence.marcas[i].ventas = 0
      }
    }
    editEvidence(evidence,evidence._id)
    .then(evidence=>{
      this.props.history.push('/evidencias')
    })
    .catch(e=>{
      console.log(e)
      this.handleOpen2()
    })
  }
  render(){
    const {marcas,imagen,boton,mensaje} = this.state;
      return (
        <div>
        <TabSup />
        <div className="padreProfile">
          <div className="h5EnviarEvi">
            <FontIcon className="material-icons icon">create</FontIcon>
            <h5>Editar Evidencia</h5>
          </div> 
          <hr/> 
          <div>
          <b> &larr; Desliza horizontalmente &rarr; </b>
            <br/><br/>
              <div style={{display: 'flex', flexWrap: 'nowrap',overflowX: 'auto'}}>
              {marcas.map((marca)=>(
                <div style={{textAlign: 'left'}} key={marca._id.nombre}>
                  <Chip
                   style={styles2.chip}
                  >
                  <Avatar src={marca._id.imagen} />
                    {marca._id.nombre}
                  </Chip>
                  <TextField
                    onInput={(e)=>{ 
                      let dosDigitos = e.target.value 
                      dosDigitos = Math.max(0, parseInt(e.target.value,10) ).toString().slice(0,2)
                      e.target.value = Number(dosDigitos)
                    }}
                    min={0}
                    onChange={this.onChangeEvidence}
                    name={`${marca._id._id}`}
                    defaultValue={marca.ventas}
                    type="number"
                    hintText="Ventas por Marca"
                    errorText="Cantidad Vendida"
                    errorStyle={styles2.errorStyle} 
                    underlineStyle={styles2.underline}
                  />
                </div>
                ))}
              </div>
              <hr/>
            <div style={imagen ? {display:"inline"} : {display:"none"}}>
              <img width="70%" src={imagen} alt="Imagen Evidencia"/>
              <br/>
              <FlatButton
                label="Cambiar Imagen"
                labelPosition="before"
                labelStyle={{color:"FAFAFA"}}
                style={styles.uploadButton}
                containerElement="label"
                backgroundColor="#00897B"
              >
                <input onChange={this.getFile} type="file" style={styles.uploadInput} />
              </FlatButton>
              <hr/>
            </div>
              <div>
              <TextField
                defaultValue={mensaje}
                floatingLabelText="Mensaje Opcional:"
                floatingLabelFixed={true}
                name="mensaje"
                onChange={this.onChange}
              />
              <br/><br/>
            </div>
            <div>
            <RaisedButton 
              disabled={boton}
              labelStyle={boton ? {color:"black"}: {color:"white"}} 
              backgroundColor="#B71C1C" 
              label="Enviar cambios" 
              fullWidth={true} 
              onClick={this.sendChanges}
            />
            <br/><br/>
            </div>
          </div>
        </div>
        <div>
        <Dialog
          modal={false}
          open={this.state.open}
        >
          <div style={{textAlign:'center'}}>
            <CircularProgress size={60} thickness={7} />
          </div>
        </Dialog> 
        </div>
        <div>
        <Dialog
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
        >
          <div style={{textAlign:'center'}}>
            Ups! Algo salió mal, vuelve a intentarlo.
          </div>
        </Dialog> 
        </div>
        </div>
      );
    }
    
  }
  

export default EditEvidence;
