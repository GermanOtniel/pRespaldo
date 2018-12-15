import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { createEvidence } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {green700,blue500,grey500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import './dinamica.css';
import { Mixpanel } from '../../mixpanel/mixpanel';


const styles2 = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto'
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
  uploadButton:{
    color:"#FAFAFA"
  },
  errorStyle: {
    color: green700,
  },
  label2:{
    color:'#004D40'
  },
  underline:{
    width: '75%'
  }
};


const style = {
  hiddenImage:{
    display:"none"
  },
  checkbox: {
    marginBottom: 16,
  },
  hintText:{
    color: blue500,
    fontSize: '16px'
  },
  errorStyle2: {
    color: grey500,
  }
};

class SendEvidence extends Component{

  state={
    dinamic:{},
    open: false,
    open2:false,
    evidencia:{},
    fotito:"",
    file:{},
    marcas:[],
    chipData:[],
    progresoImagen:0,
    marcaDetalle:{},
    boton:true,
    faltaImagen:true,
    completa:true,
    open3:false,
    open4:false,
  }

  // AQUI SE TRAEN LOS DETALLES DE UNA DINAMICA, PERO TAMBIEN SE TRAEN LAS EVIDENCIAS QUE HA GENERADO ESA DINAMICA
  // Y SE ORDENAN POR USUARIO QUE LAS HA CREADO, SE HACE UNA OPERACION MATEMATICA PARA ASIGNAR VENTAS TOTALES O PUNTOS
  // SEGUN CORRESPONDA EL CASO
  componentWillMount(){
    let id = this.props.match.params.id
    this.setState({id})
   getSingleDinamic(id)
   .then(dinamic=>{
     let marcas = dinamic.marcaPuntosVentas.map(marca=> marca);
     let chipData = marcas
     dinamic.fechaI = dinamic.fechaInicio.slice(0,10)
     dinamic.fechaF = dinamic.fechaFin.slice(0,10)
     this.setState({dinamic,marcas,chipData})
   })
   .catch(e=>alert(e));
 }
  
// ESTA FUNCION GUARDA LAS FOTOS DE LAS EVIDENCIAS EN FIREBASE STORAGE E 
// INSERTA EL LINK DE LA IMAGEN EN LOS DATOS QUE SE ENVIARAN COMO EVIDENCIA.
  getFile = e => {
   let {dinamic,boton} = this.state;
   const file = e.target.files[0];
   const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
   const date = new Date();
   const date2 = String(date).slice(4,24)
   const numberRandom = Math.random();
   const number = String(numberRandom).slice(2,16)
   const child = 'evidenceOf'+correo + date2 + number
   const carpet = "evidenciasOrdenadas/" + dinamic.nombreDinamica
   //aqui lo declaro
   const uploadTask = firebase.storage()
   .ref(carpet)
   .child(child)
   .put(file);
   //firebase 3.0.0
   //r.downloadURL
  // firebase 5.0.0
   uploadTask
   .then(r=>{
    r.ref.getDownloadURL()
    .then(url=>{
      const {evidencia} = this.state;
      evidencia.archivo =  url;
      if(boton === false){
      this.setState({completa:false})
     }
     this.setState({evidencia,faltaImagen:false})
    })
    .catch(e=>console.log(e))
   })
   .catch(e=>console.log(e)) //task
   uploadTask.on('state_changed', (snap)=>{
     const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
     this.setState({progresoImagen});
   })
  };

// ABRIR Y CERRAR DIALOGOS INFORMATIVOS Y D ELA CREACION DE EVIDENCIAS

  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
  handleOpen3 = () => {
    this.setState({open3: true});
  };
  handleClose3 = () => {
    this.setState({open3: false});
  };
  handleOpen4 = () => {
    this.setState({open4: true});
  };
  handleClose4 = () => {
    this.setState({open4: false});
  };

// ESTA FUNCION ESTA LOCA, OSEA FUMADA PUES, Y ESTA RELACIONADA CON EL 'NAME' DE CADA 'TEXTFIELD' 
// QUE SE CREA DEPENDIENDO DE LAS MARCAS Y VENTAS QUE AGRUPA CADA DINAMICA, Y SE GUARDA EN UN ARRAY LLAMADO CHIPDATA Y QUEA SU VEZ
// ESE CHIPDATA SE IGUALA AL ATRIBUTO MARCAS DE LA EVIDENCIA QUE SE ESTA CREANDO
  onChangeEvidence = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {chipData,evidencia,faltaImagen} = this.state;
    for(let i = 0; i<chipData.length;i++){
      if(field === chipData[i]._id._id){
        chipData[i].ventas = value
      }
    }
    if(faltaImagen === false){
      this.setState({completa:false})
    }
    evidencia.marcas = chipData;
    this.setState({evidencia,chipData,boton:false})
  }

  // ES EL ONCHANGE QUE GUARDA LA INFO DE LA EVIDENCIA QUE SE ESTA CREANDO, 
  // EN SI SOLO ES PARA EL MENSAJE QUE PUEDE LLEVAR UNA EVIDENCIA
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidencia} = this.state;
    evidencia[field] = value;
    this.setState({evidencia}); 
  }
  // UNA VEZ QUE SE HA CREADO UNA EVIDENCIA SE ENVIA ESTA, PERO ANTES SE LE AGREGAN UNAS CUANTAS COSAS
  // SE AGREGA UNA FECHA EN STRING, ESTO ES UTIL PARA EL REPORTE DE VENTAS POR FECHA, SE AGREGA EL ID DEL USUARIO QUE CREA ESTA EVIDENCIA
  // SE AGREGA EL ID DE LA DINAMICA A LA QUE PERTENECE ESTA EVIDENCIA, SE AGREGA LA MODALIDAD DE LA DINAMICA
  //SE AGREGA EL BRAND A LA QUE PERTENECERA ESTA EVIDENCIA
  // TODO ESTO ES PORQUE PUES S ENCESITA Y PUNTO
  // SI LA DINAMICA NO NECESITABA REVISAR EVIDENCIAS LA EVIDENCIA YA SALE APROBADA DESDE AQUI, SINO SALE COMO PENDIENTE
  // DESPUES DE TODOS ESTOS CAMBIOS SE CREA LA EVIDENICA ES DECIR SE MANDA A NUESTRO BACKEND PARA QUE SE CREE  
  sendEvidencia = (e) => {
    const {evidencia,dinamic} = this.state;
    let nombre = `${JSON.parse(localStorage.getItem('user')).nombre}`;
    let espacio = ' ';
    let apellido = `${JSON.parse(localStorage.getItem('user')).apellido}`;
    let fecha = new Date()
    evidencia.fecha = String(fecha).slice(0,15)
    const idUser = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const idDinamica = this.state.dinamic._id;
    evidencia.creador = idUser;
    evidencia.dinamica = idDinamica;
    evidencia.modalidad = dinamic.modalidad;
    evidencia.brand = dinamic.brand;
    if(this.state.dinamic.checkEvidences === false){
      evidencia.status = "Aprobada"
    }
    this.setState({evidencia});
    createEvidence(this.state.evidencia)
    .then(r=>{
      this.handleOpen3();
      Mixpanel.track('Evidence created',{
        "dinamicEvidence":dinamic.nombreDinamica,
        "dateEvidenceCreated": new Date(),
        "creator": nombre + espacio + apellido
      })
    })
    .catch(e=>{
      this.handleOpen4()
    })
  }

// LO QUE HACE ES DIRIGIR AL USUARIO HACIA LA DINAMICA A LA QUE SUBIO LA EVIDENCIA
backToDinamic = () =>{
  let {dinamic} = this.state;
    this.props.history.push(`/dinamica/${dinamic._id}`)
  }

  // ESTE RENDER CHIP ES PARA QUE EL USUARIO INGRESE SUS VENTAS POR MARCA, 
  // SI VEZ EL NAME DE CADA TEXTFIELD DE LA MARCA LO HEREDA DEL ID DE LA MARCA CORRESPONDIENTE
  // ESTE RNEDER CHIP SE VE EN LAS MARCAS QUE SE MUEVEN HORIZONTALMENTE
  renderChip(data) {
    return (
     <div className="chipsVetas" key={data._id.nombre}>
      <Chip
       style={styles2.chip}
      >
      <Avatar src={data._id.imagen} />
        {data._id.nombre}
      </Chip>
      <TextField
      onInput={(e)=>{ 
        let dosDigitos = e.target.value 
        dosDigitos = Math.max(0, parseInt(e.target.value,10) ).toString().slice(0,2)
        e.target.value = Number(dosDigitos)
      }}
      min={0}
      onChange={this.onChangeEvidence}
      name={`${data._id._id}`}
      type="number"
      hintText="Ventas por Marca"
      errorText="Cantidad Vendida"
      errorStyle={styles2.errorStyle} 
      underlineStyle={styles2.underline}
    />
      </div>
    );
  }
  
  render(){
    const {dinamic} = this.state;
    const actions2 = [
      <RaisedButton 
              onClick={this.backToDinamic}  
              label="Ok" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
    ];
      return (
        <div>
          <TabSup />
          <div className="padreProfile">
          <div className="h5EnviarEvi">
          <FontIcon className="material-icons icon">add_to_home_screen</FontIcon>
          <h5>Envía tu Evidencia</h5>
          </div>
          <hr/>
          <h5 className="sendEvidencia">Define cuantas ventas hiciste de cada marca:</h5>
            <b> &larr; Desliza horizontalmente &rarr; </b>
            <br/>
            <br/>
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
            <hr/>
            <TextField 
              name="mensaje" 
              type="text"  
              hintText="Mensaje Opcional"
              errorText="Este campo no es obligatorio"
              hintStyle={style.hintText} 
              errorStyle={style.errorStyle2} 
              rowsMax={3}
              maxLength={150}
              onChange={this.onChange}
              underlineShow={true}
              multiLine={true}
            />
            <hr/>

            <div style={dinamic.imagen ? style.preview : style.hiddenImage}>
              <FlatButton
                label="Envía una imagen"
                labelPosition="before"
                style={styles2.uploadButton}
                containerElement="label"
                backgroundColor="#00897B"
              > 
                <input onChange={this.getFile} name="fotoPerfil" type="file" style={styles2.uploadInput} />
              </FlatButton>
            <br/>
            <LinearProgress mode="determinate" value={this.state.progresoImagen} />
             <span>{
               this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" 
               : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se está cargando..." 
               : "La imagen tarda unos segundos en cargar")
              }</span>
            <br/>
            </div>
            <br/>
            <RaisedButton 
              disabled={ dinamic.imagen ? this.state.completa : this.state.boton}
              onClick={this.sendEvidencia}  
              label="Enviar Evidencia" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
          </div>
          <div>
          <Dialog
            modal={false}
            actions={actions2}
            open={this.state.open3}
            autoScrollBodyContent={true}
          >
          <div className="padreProfile">
              Tu evidencia ha sido creada satisfactoriamente, tan solo debes de 
              esperar a que esta sea Aprobada para asi asignarte tus ventas o puntos.
            <br/>
          </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          modal={false}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}
        >
          <div className="padreProfile">
            Parece que algo salió mal...asegurate de estar conectado a Internet e ¡Inténtalo de nuevo!
          </div>      
        </Dialog> 
        </div>
      </div>
      );
    }
    
  }

  

export default SendEvidence;