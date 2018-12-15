import React, {Component} from 'react';
import {getSingleUser,editProfile} from '../../services/auth';
import FontIcon from 'material-ui/FontIcon';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100vw',
    height: '70vh',
    overflowY: 'auto',
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
  }
};

// ESTE COMPONENTE MUESTRA LOS DOCUMENTOS PERSONALES DE CADA USUARIO
// EN REALIDAD SON FOTOGRAFIAS DE LOS DOCUMENTOS

class Documentos extends Component{

  state={
    user: {},
    open:false,
    open2:false,
    identificacion:"",
    acta:"",
    curp:"",
    documentos:[],
    newUser:{},
    progresoImagen:0
  }

  // TRAEMOS A UN USUARIO Y PONEMOS EN EL STATE CADA DOCUMENTO, PARA PODER MANEJARLO DE UNA MEJOR MANERA
  // EL ARRAY DE DOCUMENTOS ES PARA QUE CADA UNO TENGA LA OPCION FEATURED COMO TRUE, ESTA OPCION ERA NECESARIA PARA LA REPRESENTACION VISUAL
  componentWillMount(){
    let {identificacion,acta,curp,documentos} = this.state;
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
   getSingleUser(id)
   .then(user=>{
     identificacion = user.documentos.idOficial;
     acta = user.documentos.actaNac;
     curp = user.documentos.curp;
     documentos = [
       {
         nombre:"Identificación Oficial",
         imagen: identificacion,
         featured: true
       },
       {
         nombre:"Acta de Nacimiento",
         imagen:acta,
         featured: true
       },
       {
         nombre:"CURP",
         imagen:curp,
         featured:true
       }
     ]
    this.setState({user,identificacion,acta,curp,documentos,newUser:user})
   })
   .catch(e=>console.log(e));
 }

 // LA FUNCION QUE USAMOS PARA LA SUBIDA DE FOTOS
 // HAY 3 IFS PARA SEPARAR SI ES IDENTIFICACION OFICIAL O CURP O ACTA DEPENDIENDO DE LO QUE SEA SE GUARDA EN DISTINTO LUGAR
 // DENTRO DEL USUARIO
  getFile=(documento,e)=>{
    let id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const file = e.target.files[0];
    const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
    const date = new Date();
    const date2 = String(date).slice(0,24)
    const child = date2 + documento.nombre
    const carpet = "documentos/" + correo
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
        const {newUser,documentos} = this.state;
        if(documento.nombre === "Identificación Oficial"){
          newUser.documentos.idOficial =  url;
          documentos[0].imagen = url;
        }
        if(documento.nombre === "Acta de Nacimiento"){
          newUser.documentos.actaNac =  url;
          documentos[1].imagen = url;
        }
        if(documento.nombre === "CURP"){
          newUser.documentos.curp =  url;
          documentos[2].imagen = url;
        }
        editProfile(newUser,id)
          .then(user=>{
          })
          .catch(e=>console.log(e))
          this.setState({newUser,documentos})
      })
      .catch(e=>console.log(e))
    })
    .catch(e=>console.log(e)) //task
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      if(progresoImagen >= 0 && progresoImagen < 100){
        this.setState({open2:true})
      }
      else if (progresoImagen === 100){
        this.setState({open:true,open2:false})
      }
      this.setState({progresoImagen});
    })
  }

  // SE ABRE PARA VER EL PROGRESO DE LA IMAGEN QUE SE ESTA SUBIENDO
  handleClose=()=>{
    this.setState({open:false,progresoImagen:0})
  }

  render(){
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ]
    const {open,documentos,open2} =this.state;
      return (
        <div className="padreProfile">
        <div>
        <TabSup/>
        </div>
        <div className="padreProfile">
          <div className="h5EnviarEvi">
            <FontIcon className="material-icons ">insert_drive_file</FontIcon>
            <h4>Mis Documentos</h4>
          </div> 
          <hr/>      
        </div>
        <div style={styles.root}>
          <GridList
            cols={2}
            cellHeight={200}
            padding={1}
            style={styles.gridList}
          >
            {documentos.map((documento,index) => (
              <GridTile
                key={index}
                title={documento.nombre}
                actionIcon={<FlatButton
                  label={<FontIcon style={{color:'white'}} className="material-icons">note_add</FontIcon>}
                  labelPosition="before"
                  style={styles.uploadButton}
                  containerElement="label"
                > 
                  <input onChange={(e)=>this.getFile(documento,e)} name="fotoPerfil" type="file" style={styles.uploadInput} />
                </FlatButton>}
                actionPosition="left"
                titlePosition="top"
                titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                cols={documento.featured ? 2 : 1}
                rows={documento.featured ? 2 : 1}
              >
                <img alt={documento.nombre} src={documento.imagen} />
              </GridTile>
            ))}
          </GridList>
        </div>
        <div>
        <Dialog
          title="Información:"
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          actions={actions}
          onRequestClose={this.handleClose}
        >
          <div className="padreProfile">
            Tu documento se ha actualizado correctamente.
          </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          title="Tu imagen se esta cargando:"
          modal={false}
          open={open2}
          autoScrollBodyContent={true}
        >
          <b>Espera un poco...</b>
          <LinearProgress mode="determinate" value={this.state.progresoImagen} />
        </Dialog> 
        </div>
        </div>
      );
    }
    
  }
  

export default Documentos;
