import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import { editProfile } from '../../services/auth';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import { getCenters } from '../../services/centros';
import TabSup from './TabSup';
import FlatButton from 'material-ui/FlatButton';
import firebase from '../../firebase/firebase';
import './profile.css';


const styles = {
 
  autoHidden: {
    display: 'none'
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
  hintText:{
    color: blue500,
    fontSize: '16px'
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

class EditProfile extends Component{

  state={
    id: null,
    newProfile:{},
    centers:[],
    progresoImagen:0
  }

    // CUANDO SE MONTA EL COMPONENTE TRAEMOS AL USUARIO MEDIANTE SU ID, Y REVISAMOS, SI SU CUENTA NO ESTA CONFIRMADA Y 
    // NO SE LE HA MANDADO CORREO PUES LE MANDAMOS UN CORREO PARA QUE CONFIRME SU CUENTA, EL CORREO ENVIA LA DIRECCION DE NUESTRO BACKEND
    // Y POSTERIORMENTE EN EL BACKEND SE CREARA UN CORREO Y UN LINK PARA QUE CUANDO EL USUARIO DE CLICK EN ESE LINK SU CIENTA SE CONFIRME
    // MIENTRAS NO CONFIRME SU CUENTA EL USUARIO UN DIALOGO LE SEGUIRA APARECIENDO Y RECORDANDO QUE NO HA CONFIRMADO SU CUENTA
    // TAMBIEN TRAEMOS TODOS LOS CENTROS QUE EXISTEN EN NUESTRA APP PARA QUE ELIJA ALGUNO DE ELLOS, COMO EL CENTRO DE CONSUMO EN EL QUE TRABAJA
  componentWillMount(){
    const id = this.props.match.params.id
   getCenters()
   .then(centers=>{
     this.setState({centers,id})
   })
   .catch(e=>alert(e))
 }


 // CUANDO UN USUARIO ESTA EDITANDO SU PERFIL
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newProfile} = this.state;
    newProfile[field] = value;
    this.setState({newProfile}); 
  }

  // PARA GUARDAR LA IMAGEN QUE ESTA SUBIENDO NUESTRO USUARIO Y GUARDAR LA URL QUE SE ACABA DE CREAR Y GUARDARLA EN LA BASE DE DATOS
  getFile = e => {
    const file = e.target.files[0];
    const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
    const date = new Date();
    const date2 = String(date).slice(16,24)
    const numberRandom = Math.random();
    const number = String(numberRandom).slice(2,16)
    const child = 'profileOf'+correo + date2 + number
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref("users")
    .child(child)
    .put(file);
    //aqui agreggo el exito y el error
    uploadTask
    .then(r=>{
      r.ref.getDownloadURL()
      .then(url=>{
        console.log(url)
        const {newProfile} = this.state;
        newProfile.fotoPerfil =  url;
        this.setState({newProfile})
      })
      .catch(e=>console.log(e))
    })
    .catch(e=>console.log(e)) //task
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      this.setState({progresoImagen});
    })
  };

  // FUNCION PARA SELECCIONAR EL CENTRO DE CONSUMO Y ESTE SE INSERTE EN LA INFO DE NUESTRO USUARIO
  onNewRequest = (chosenRequest) => {
    const {newProfile} = this.state;
    newProfile.centroConsumo =  chosenRequest;
    this.setState({newProfile});
  }

  // SE ENVIA LOS CAMBIOS EDITADOS DE NUESTRO USUARIO AL BACKEND PARA QUE A SU VEZ SE GUARDE EN NUESTRA BASE DE DATOS
  sendEdit = (e) => {
    const id = this.state.id;
    const {newProfile} = this.state;
    editProfile(newProfile,id)
    .then(user=>{
      localStorage.setItem('user', JSON.stringify(user))
      this.props.history.push(`/profile/${user._id}`)
    })
    .catch(e=>console.log(e)) 
  }


  render(){
      return (
        <div className="padreProfile">
        <TabSup />
        <br/>
    <div>
      {/* <h4>Editar Perfil</h4> */}
      <img className="imgEditProf" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed" alt="Loguito"/>
      <hr style={{marginBottom:'-6px'}}/>
      <FontIcon className="material-icons icon">store_mall_directory</FontIcon>
        <AutoComplete
          floatingLabelText="Elige tu Centro de Consumo"
          hintText="en el que trabajas"
          hintStyle={styles.hintText}
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.state.centers.map(centro => centro)}
          dataSourceConfig={ {text: 'nombre', value: '_id'}  }
          onNewRequest={this.onNewRequest}
          floatingLabelStyle={styles.floatingLabelFocusStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        /> 
      <Divider/><br/>
    </div>
    <div>
    <FontIcon className="material-icons icon">tag_faces</FontIcon>
      <TextField 
        onChange={this.onChange} 
        name="nombreUsuario" 
        hintStyle={styles.hintText}
        hintText="Nombre de Usuario" 
        type="text"  
        underlineShow={true} 
      />
    <Divider/><br/>
    </div>
    <div>
    <FontIcon className="material-icons icon">portrait</FontIcon>
    <TextField 
      onChange={this.onChange} 
      name="nombre" 
      hintStyle={styles.hintText}
      hintText="Nombre" 
      type="text"  
      underlineShow={true} 
    />
    <Divider/><br/>
    </div>
    <div>
    <FontIcon className="material-icons icon">person_outline</FontIcon>
    <TextField 
      onChange={this.onChange} 
      name="apellido"
      hintStyle={styles.hintText} 
      hintText="Apellido" 
      type="text"  
      underlineShow={true} 
    />
    <Divider/>
    </div>

    <div>
    <FontIcon className="material-icons icon">phonelink_ring</FontIcon>
    <TextField 
      onChange={this.onChange} 
      name="telefono"
      floatingLabelText="Teléfono" 
      floatingLabelStyle={styles.floatingLabelFocusStyle}
      hintText="Sólo números" 
      type="text"  
      underlineShow={true} 
    />
    <Divider/><br/>
    </div>
    <div>
    <FlatButton
      label="Imagen de Perfil"
      labelPosition="before"
      style={styles.uploadButton}
      containerElement="label"
      backgroundColor="#00897B"
    > 
      <input onChange={this.getFile} name="fotoPerfil" type="file" style={styles.uploadInput} />
    </FlatButton>
      <br/>
      <LinearProgress mode="determinate" value={this.state.progresoImagen} />
        <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se está cargando..." : "La imagen tarda unos segundos en cargar")}</span>
    <Divider/><br/>
    </div>
        <div>
        <RaisedButton onClick={this.sendEdit} label="Guardar Cambios" backgroundColor="#546E7A" labelColor="#FAFAFA"  />
        </div>
        </div>
      );
    }
    
  }
  

export default EditProfile;
