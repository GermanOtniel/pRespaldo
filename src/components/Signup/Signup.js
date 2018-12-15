import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {signup} from '../../services/auth';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';
import './signup.css'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};


class Signup extends Component {

  state={
    newUser:{},
    user:{},
    botonEnviar:true,
    botonGoogle:true,
    mensajeContraseñas:"",
    open:false,
    open2:false
  }

  // guardar la info QUE EL USUARIO QUE QUIERE REGISTRARSE ESTA INGRESANDO
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    let {newUser} = this.state;
    newUser[field] = value;
    if(newUser.terminosCondiciones === 'true' && newUser.correo === undefined && newUser.password === undefined){
      this.setState({botonGoogle:false}) 
    }
    else if(newUser.terminosCondiciones !== 'true' || newUser.correo !== undefined  ){
      this.setState({botonGoogle:true}) 
    }
    if(newUser.correo !== undefined){
      if(newUser.terminosCondiciones === 'true' && newUser.correo.includes('@') && newUser.correo.includes('.')){
        this.setState({botonEnviar:false}) 
      }
      else if(newUser.terminosCondiciones !== 'true' && !newUser.correo.includes('@') && !newUser.correo.includes('.')){
        this.setState({botonEnviar:true}) 
      }
      newUser.correo = newUser.correo.toLowerCase()
    }
    this.setState({newUser}); 
  }

  // REVISAR SI LAS CONTRASEÑAS SON IDENTICAS O IGUALES
  onChangeContraseñas = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    let {newUser,mensajeContraseñas} = this.state;
    newUser[field] = value;
      if(newUser.password !== newUser.password2 ){
        mensajeContraseñas = "Tus contraseñas no coinciden..."
        this.setState({mensajeContraseñas})
      }
      else if(newUser.password === newUser.password2 && newUser.password !== "" && newUser.password2 !== "" ){
        mensajeContraseñas = "Bien, tus contraseñas SI coinciden"
        this.setState({mensajeContraseñas})
      }
    this.setState({newUser}); 
  }

  // SE ENVIAN LOS DATOS DE REGISTRO PARA CREAR UN NUEVO USUARIO, SI YA HAY UN USUARIO CREADO  
  // CON ESE CORREO SE LE DICE QUE NEEE Q YA HAY UN USUARIO GUARDADO CON ESE CORREO
  sendUser = (e) => {
    localStorage.setItem('userLogged', JSON.stringify(this.state.newUser))
    let { newUser } = this.state;
    if(newUser.correo !== undefined){
      if(newUser.correo.includes('@') && newUser.correo.includes('.')){
        newUser.correo = newUser.correo.toLowerCase()
        newUser.habilidades = [{
          "_id":null,
          "limpieza": 5,
          "puntualidad": 5,
          "disciplinado": 5,
          "colaborativo": 5
        },
        {
          "_id": null,
          "limpieza": 5,
          "puntualidad": 5,
          "disciplinado": 5,
          "colaborativo": 5
        },
        {
          "_id": null,
          "limpieza": 5,
          "puntualidad": 5,
          "disciplinado": 5,
          "colaborativo": 5
        }]
        newUser.documentos = {
          "idOficial": "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fnoimagen.jpg?alt=media&token=ce3e9648-3740-465b-bc26-3318de70d4b0",
          "actaNac": "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fnoimagen.jpg?alt=media&token=ce3e9648-3740-465b-bc26-3318de70d4b0",
          "curp": "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fnoimagen.jpg?alt=media&token=ce3e9648-3740-465b-bc26-3318de70d4b0"
      }
        signup(this.state.newUser)
        .then(r=>{
          if(r.message){
            this.handleOpen()
          }
          else{
          this.props.history.push(`/profile/${r._id}`);
          }
        })
        .catch(e=>console.log(e))
      }
      else{
        this.handleOpen()
      }
    }
    else{
      this.handleOpen()
    }
  }

  // ES POR SI HAY ALGUN ERROR CON LA AUTENTICACION POR MEDIO DE GOOGLE
  onFailure = (error) => {
    console.log(error);
  };

  // PARA SACAR LOS DATOS DEL CACHE DEL USUARIO QUE ESTA INTENTANDO REGISTRARSE CON GOOGLE
  // CUANDO SE TIENEN LOS DATOS SE MANDAN AL BACKEND PARA QUE PROCEDA CON EL REGISTRO Y CREACION DE UN USUARIO NUEVO
  googleResponse = (response) => {
      const {user,newUser} = this.state;
      user.nombreUsuario = response.profileObj.name;
      user.correo = response.profileObj.email;
      user.googleId = response.profileObj.googleId
      user.terminosCondiciones = newUser.terminosCondiciones;
      this.setState({user});
      googleUser(this.state.user)
          .then(user=>{
          this.props.history.push(`/profile/${user._id}`);
      })
  };

  // ABRIR Y CERRAR DIALOGOS 
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };

  render() {
    const {mensajeContraseñas} = this.state;
    const actions = [
      <RaisedButton 
        onClick={this.handleClose2} 
        label="OK" 
        backgroundColor="#0D47A1" 
        labelColor="#FAFAFA" 
        />
    ]
    return (
      <div className="app">
      <div className="paper2">
        <Paper>
          <img className="imgLogin" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed" alt="Loguito"/>
        <h3>Regístrate</h3>
        <TextField
          hintText="Uno al que tengas acceso"
          floatingLabelText="Correo electrónico"
          name="correo"
          onChange={this.onChange}
        />
        <TextField
          hintText="Intenta no olvidarla"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChangeContraseñas}
        />
        <TextField
          hintText="Intenta no olvidarla"
          floatingLabelText="Confirma tu contraseña"
          type="Password"
          name="password2"
          onChange={this.onChangeContraseñas}
        />
        <div>
          <b style={mensajeContraseñas === "Bien, tus contraseñas SI coinciden" ? {color:'green'} : {color:'red'}} className="msjContraseñas">{mensajeContraseñas}</b>
        </div>
        <div className="hijoPaper">
        <RaisedButton 
        onClick={this.sendUser} 
        label="ENVIAR" 
        backgroundColor="#0D47A1" 
        labelColor="#FAFAFA" 
        className="botonIngresar"
        disabled={this.state.botonEnviar} 
        />
        <br/><br/>
        <div>
          <div style={{display:'flex',justifyContent:'center'}} >
          <RadioButtonGroup onChange={this.onChange} name="terminosCondiciones" defaultSelected="not_light">
          <RadioButton
            value={true}
          />
        </RadioButtonGroup>
        <b style={{fontSize:'12px',marginTop:'3px'}}>Acepto <a style={{color:'#42A5F5'}} onClick={this.handleOpen2}>Términos y Condiciones</a></b>
        </div>
        </div>
 
        <hr/>
        <h5 className="registrate">Si ya estás registrado <Link style={{color:'#42A5F5'}} to="/" className="linkReg">Inicia Sesión</Link></h5>
        <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Regístrate con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogleLogin"
          disabled={this.state.botonGoogle} 
          />
        </div> 
        </div>
        </Paper>
       </div>
      {/* <div className="login">
      <Paper className="paper" zDepth={5}>
       <form>
         <div className="form-group">
         <h3>Regístrate</h3>

           <input 
           onChange={this.onChange}  
           name="correo" 
           type="email" 
           className="form-control" 
           id="exampleInputEmail1" 
           aria-describedby="emailHelp" 
           placeholder="Correo electrónico" 
           />
           <small id="emailHelp" className="form-text text-muted">Tus datos estarán seguros con nosotros.</small>
         </div>
         <div className="form-group">
           <input 
           onChange={this.onChangeContraseñas}  
           name="password" 
           type="password" 
           className="form-control" 
           placeholder="Contraseña"
           />
        </div>
        <div className="form-group">
           <input 
           onChange={this.onChangeContraseñas} 
           name="password2" 
           type="password" 
           className="form-control marginInput"  
           placeholder="Repite tu contraseña"
           />
        </div>
        <div>
          <b style={mensajeContraseñas === "Bien, tus contraseñas SI coinciden" ? {color:'green'} : {color:'red'}} className="msjContraseñas">{mensajeContraseñas}</b>
        </div>
        <button disabled={this.state.boton} onClick={this.sendUser} type="submit" className="btn btn-primary">Enviar</button>
        <hr/>
        <h6>Si ya estás registrado <Link to="/">Inicia sesión</Link></h6>
        <hr/>
       </form>
       <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Ingresa con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogle"
        />
        </div>       
      </Paper>
       
     </div> */}
     <div >
        <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}      
        > 
         Ups, algo salió mal, parece ser que el correo que quieres registrar ya ha sido utilizado en el pasado ó no es válido. <br/><br/>
         Te recomendamos revisar el correo electrónico que estas ingresando.
        </Dialog>  
        </div> 
        <div>
        <Dialog
          modal={false}
          open={this.state.open2}
          actions={actions}
          onRequestClose={this.handleClose2}
          contentStyle={customContentStyle}
          autoScrollBodyContent={true}      
        > 
         AVISO DE PRIVACIDAD<br/><br/>

Inicio de vigencia: 1º de Marzo 2018<br/><br/>

15 Onzas Inteligencia tras la barra SAPI de CV, con domicilio en Oaxaca 96 int E04 Colonia Roma, Delegación Cuauhtémoc, CP. 06700 en la Ciudad de México es el responsable del tratamiento de sus datos personales, del uso que se da a los mismos y de su protección. Este Aviso provee información relevante para: (i)  las personas que visitan nuestro sitio web localizado en http://1puntocinco.com (el "Sitio Web"), incluyendo aquellas que se registran para recibir alguno de los servicios que ofrece el Sitio Web y; (ii) para  los clientes que descargan alguna de nuestras aplicaciones móviles y que nos proporcionan sus datos personales para alguna finalidad (a los usuarios y visitantes de nuestro Sitio web y a nuestros clientes en aplicación móvil se les denominará conjuntamente los "clientes" o "usted"). El presente Aviso detalla la forma en que 1puntocinco,  sus afiliadas y subsidiarias  (todos los anteriores, conjuntamente “1puntocinco” o "nosotros") utilizan sus datos personales y sobre los derechos que usted tiene. Por favor tómese un minuto para revisar esta información.
<br/><br/>
1. ¿Qué datos personales obtenemos de usted?<br/>
Para las finalidades establecidas en este Aviso de Privacidad, 1puntocinco obtendrá de los clientes que utilicen nuestro Sitio Web y de aquellos que voluntariamente nos los proporcionen en nuestras aplicaciones móviles los siguientes datos personales:
<br/><br/>
a. Datos de identificación: nombre y apellidos, fecha de nacimiento, género y otros datos que se tengan disponibles en su perfil público de Facebook.
<br/><br/>
b. Datos de contacto: correo electrónico disponible en su perfil público de Facebook y dirección de casa con código postal y número móvil cuando aplique.
<br/><br/>
c. Imágenes, ntereses y datos de amigos: Estos datos pueden ser obtenidos a través de la Interfaz Connect de Facebook para mejorar la experiencia de navegación y perfilamiento.
1puntocinco obtiene datos personales de los clientes cuando estos visitan nuestro Sitio Web  y voluntariamente completan nuestro formulario de contacto y aceptan expresamente recibir información sobre nuestras ofertas y novedades (que son enviadas a través de nuestro Newsletter y Notificaciones vía Aplicaciones Móviles).  Adicionalmente, podemos obtener sus datos directamente en nuestras aplicaciones móviles, cuando usted nos solicita que lo registremos a nuestros servicios de Newsletter, usualmente mediante el llenado del formulario correspondiente. Asimismo, obtendremos de forma indirecta sus datos personales que estén disponibles en su perfil de Facebook.
<br/><br/>
2. No obtenemos datos sensibles.<br/>
1puntocinco podrá obtener su afiliación política únicamente si usted así lo ha indicado en su perfil de Facebook. Si usted quiere evitar que 1puntocinco obtenga este dato, por favor modifique sus preferencias de privacidad o envie un correo a hello@15onzas.com. 1puntocinco no obtiene ningún otro dato considerado sensible, y en caso de obtenerlo, será eliminado inmediatamente.
<br/><br/>
3. Obtención de datos a través de Cookies y otras tecnologías<br/>
Nuestro Sitio Web utiliza "Cookies". Las cookies son pequeños archivos de datos que se almacenan en el disco duro de su equipo de cómputo o del dispositivo de comunicación electrónica que usted utiliza cuando navega en nuestro Sitio Web. Estos archivos de datos permiten intercambiar información de estado entre nuestro Sitio Web y el navegador que usted utiliza. La "información de estado" puede revelar medios de identificación de sesión, medios de autenticación o sus preferencias como usuario, así como cualquier otro dato almacenado por el navegador respecto del Sitio Web.

Las cookies nos permiten monitorear el comportamiento de un usuario en línea. Utilizamos la información que es obtenida a través de cookies para ayudarnos a optimizar configuraciones del Sitio Web y así mejorar su experiencia como  usuario (v.g. identificar desde que país ingresa y re-direccionarlo al sitio correspondiente). A través del uso de cookies podemos, por ejemplo, personalizar en su favor nuestra página de inicio de manera que nuestras pantallas se desplieguen de mejor manera de acuerdo a su tipo de navegador.

Como la mayoría de los sitios web, nuestros servidores registran su dirección IP, la dirección URL desde la que accedió a nuestro Sitio web, el tipo de navegador, y la fecha y hora en que realiza actividad. Utilizamos esta información para la administración del sistema y optimización de su uso del Sitio Web.

Su navegador aceptará las cookies y permitirá la recolección automática de información a menos que usted cambie la configuración predeterminada del navegador. La mayoría de navegadores web permiten que usted pueda gestionar sus preferencias de cookies.

Puede ajustar su navegador para que rechace o elimine cookies. Los siguientes links muestran como ajustar la configuración del navegador de los navegadores que son utilizados con más frecuencia:

Chrome
Firefox
Safari
Internet Explorer
Si se inhabilitan las cookies del Sitio Web, nuestro Sitio no se cargará apropiadamente y podría no habilitar ciertos hipervínculos.
<br/><br/>
4. Uso de cookies y web Beacons de terceros<br/>
1puntocinco trabaja con Facebook, Google Analytics, VIMEO y otros proveedores de servicios que utilizan tecnología para ayudarnos a ofrecer nuestros propios contenidos, ofrecer publicidad dirigida y obtener métricas anónimas y análisis del sitio. En los contratos correspondientes, solicitamos a estas empresas utilizar la información que obtienen sólo para proporcionarnos los servicios que requerimos. Aunque estas empresas utilizan alguna información anónima sobre usted para mostrar anuncios, prohibimos contractualmente a estas empresas obtener  datos personales acerca de usted.

Muchos de nuestros proveedores de servicios participarán en el programa NAI opt-out. Usted tiene la opción de solicitar ser excluido del uso de dicha información para tales propósitos haciendo clic aquí.  Para ser excluido de Google Analytics haga clic aquí.  De otra manera nosotros no respondemos a señales "No Rastreamos" de navegadores en estos momentos.
<br/><br/>
5. ¿Para qué utilizamos sus datos personales?<br/>
La obtención y tratamiento de sus datos personales se realiza para las siguientes finalidades:

a. Envío de Newsletter, el cual incluye contenidos, invitaciones, beneficios exclusivos,  recomendaciones, publicidad y ofertas, cuando usted así lo haya elegido;
b. Realizar estudios de mercado, (por ejemplo, refiriéndose a la frecuencia de compras, edad, entre otras) los cuales se realizarán de forma desagregada; y
c. Monitoreo y trackeo de asistencia y consumo, a través de nuestras aplicaciones móviles, programas de lealtad y comercio electrónico.
El suscribirse a nuestros servicios informativos y de publicidad es absolutamente voluntario. Nosotros no requerimos el hacerle llegar publicidad para mantener o conservar la relación jurídica que podríamos tener con usted en un momento determinado; por ello, usted siempre tendrá la opción inicial de no suscribirse a nuestros sistemas de publicidad; asimismo,  tendrá en todo momento la posibilidad de elegir dejar de recibir nuestros mensajes comerciales, ofertas y publicidad. Para ello, usted solamente deberá elegir la opción de "deslistarse" misma que  existirá en cada uno de los mensajes que reciba.
<br/><br/>
6. ¿Con quien compartimos sus datos personales?<br/>
1puntocinco puede transferir los datos personales de sus clientes a otras empresas o autoridades para efectos de las finalidades establecidas en este Aviso de Privacidad. Estas transferencias incluyen las siguientes:

a. En tanto que 1puntocinco forma parte de un grupo internacional, sus datos personales pueden ser comunicados a otras empresas de nuestro mismo grupo corporativo, incluyendo nuestras afiliadas, mismas que se encuentran localizadas fuera de México. Nuestras afiliadas han implementado medidas y políticas para la protección de los datos personales de nuestros clientes; estas políticas resultan consistentes con las nuestras y tratan de cumplir con lo dispuesto por las leyes de cada país.  
b. 1puntocinco puede remitir todos o parte de los datos personales a proveedores de servicios que nos apoyan en algún proceso. Estos proveedores incluyen: (i)  empresas de tecnología que nos prestan diversos servicios de comunicaciones o infraestructura; (ii) empresas que nos prestan servicios de publicidad, logística o administración de programas de lealtad (iii) empresas a quienes prestamos servicios de publicidad, mercadeo, propaganda e investigación de mercados, quienes podrán utilizar dichos datos para los mismos fines descritos en el inciso 5 de este aviso. En todos estos casos, 1puntocinco se asegura de que estos proveedores asuman obligaciones contractuales que permitan que los datos personales de nuestros clientes se encuentren protegidos.
c. Así mismo, 1puntocinco puede transferir datos personales de sus clientes a autoridades administrativas o judiciales, cuando la transferencia sea necesaria o legamente exigida par la salvaguarda de un interés público, la protección de los derechos de 1puntocinco, la protección de derechos de terceros  o para la procuración o administración de justicia. Adicionalmente, 1puntocinco puede usar o divulgar sus datos personales cuando consideremos, de buena fe, que la legislación aplicable nos permite usar o divulgar sus datos. Lo anterior incluye, por ejemplo, cuando dicha transferencia resulte necesaria para protegerlo a usted, para responder a reclamaciones o para proteger los derechos de propiedad o la seguridad de 1puntocinco, de sus afiliadas o los derechos de terceros.
d. Asimismo, la información de los clientes podrían ser comunicados o transferidos a un tercero, en el contexto de la negociación de una transacción corporativa, incluyendo una fusión o una venta de activos o una adquisición.
e. En otros casos, cuando lo permitan las leyes aplicables o se cuente con su consentimiento para realizar la transferencia.
En virtud de la naturaleza internacional de las operaciones de 1puntocinco, todas las transferencias anteriores pueden tener el carácter nacional o internacional; asimismo, todas son precisas para el mantenimiento o cumplimiento de la relación comercial que 1puntocinco tiene con los clientes y, por lo tanto, no requerimos el consentimiento del cliente para realizarlas. 1puntocinco no renta ni vende a terceros los datos personales que obtiene de usted.

<br/><br/>
7. ¿Cuáles son sus derechos?<br/>
Usted cuenta en todo momento con el derecho de acceder y consultar la información que tenemos de usted: asimismo, con el derecho de solicitar que dicha información sea rectificada o cancelada; usted puede oponerse a que 1puntocinco trate sus datos para fines específicos y/o revocar en cualquier tiempo el consentimiento que nos haya otorgado para el tratamiento de sus datos personales en la medida que la ley lo permita. Para ejercitar dichos derechos o para formular cualquier duda o queja con relación al tratamiento de sus datos personales por favor contacte a nuestro Departamento de Datos Personales (“DDP”). Por favor dirija su solicitud a hello@15onzas.com, en atención al "Responsable del Departamento de Datos Personales"

Sus solicitudes serán evaluadas en los términos establecidos en las leyes aplicables. Nuestro DDP le comunicará (i) la información que se le solicitará para que se identifique así como los documentos que necesitará enviar junto con su solicitud; (ii) los plazos en los que recibirá una contestación sobre su solicitud; (iii) cómo debe de presentar su solicitud, incluyendo los formularios que puede usar para presentar su solicitud, si los hubiere, y; (iv)  la modalidad o medio en que le entregaremos la información a usted.
<br/><br/>
8. ¿Qué opciones tengo para limitar la forma en que 1puntocinco utiliza mis datos personales?<br/>
1puntocinco le ofrece la posibilidad de tomar decisiones sobre cómo usamos sus datos personales; le ofrecemos diversos medios para informarnos acerca de su decisión.

Si usted no desea recibir mensajes publicitarios de nosotros o cancelar su suscripción a nuestros servicios informativos usted: (a) puede solicitar cancelar su suscripción a nuestras listas de correo haciendo uso del mecanismo establecido en nuestros correos electrónicos; (b) puede borrar la aplicación de 1puntocinco Media dentro de Facebook y (c) puede borrar las aplicaciones móviles desarrolladas por 1puntocinco en su teléfono móvil.
<br/><br/>
9. Medidas de Seguridad.<br/>
1puntocinco ha adoptado medidas de seguridad  físicas, organizacionales, y técnicas para proteger sus datos personales en contra de pérdida, uso o acceso no autorizado.

10. Modificaciones al Aviso de Privacidad.<br/>
1puntocinco se reserva el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente Aviso de Privacidad. El aviso modificado será publicado en lugares visibles en nuestras aplicaciones móviles y/o en nuestra página web o se le hará llegar a través de correo electrónico. Nuestros clientes podrán verificar que el Aviso ha sido modificado en virtud de que haremos notar siempre la fecha de última actualización. En caso de 1puntocinco realice algún cambio sustancial en el tratamiento de sus datos personales, se lo haremos saber a través de una notificación a su correo electrónico o anunciando estos cambios en nuestro Sitio Web. Todo cambio realizado a nuestro aviso de privacidad entra en vigor  a los 30 días naturales de la publicación del nuevo aviso. Si usted no esta de acuerdo con las modificaciones, por favor contacte a nuestro DDP.
<br/><br/>
PRIVACY NOTICE
<br/>
Effective date: March 1st 2018
<br/>
15 Onzas Inteligencia tras la barra SAPI de CV, domiciled at Oaxaca 96 int E04 Colonia Roma, Delegación Cuauhtémoc, CP. 06700 en la Ciudad de México, is the data controller with regard to the processing of your personal data and the protection of such data. This Notice provides relevant information for: (i) people who visit our website located at http://1puntocinco.com (the "Website"), including all people who subscribe to any of our services offered at the Website and; (ii) customers who download our mobile applications and provide us with their personal data for any purposes (our Website's users and visitors and our mobile application customers will be defined jointly as "customers" or "you"). This Notice details how 1puntocinco, its affiliates and subsidiaries (collectively "1puntocinco" or "us") use your personal data and the rights you are entitled to. Please take a minute to review this information.
<br/>
1. What personal data do we obtain from you?<br/>
For the purposes set out in this Privacy Notice, 1puntocinco will obtain from the customers who use our Website and from those who voluntarily provide our mobile application the following personal data:
<br/>
a. Identification data: name and surname, date of birth, genre and data that is available in your Facebook public profile.
b. Contact information: email address available in your Facebook public profile and home address with zip code and mobile number when applicable.
c. Images, interests and friends data: This data may be obtained through Facebook’s API Connect to improve the navigation experience as well as profiling.
1puntocinco obtains personal data from its customers when they visit our Website and voluntarily fill out our contact forms and agree to receive information regarding our sales and news (sent through our Newsletter and Notifications via Mobile Applications). Additionally, we may obtain your data personally when downloading our mobile applications and when you request us to register you to our newsletter services, usually by filling out the appropriate form. We will also obtain in an indirect manner some personal data from your Facebook profile.
<br/>
2. No collection of sensitive personal data.<br/>
1puntocinco can obtain your political opinions only if you have indicated in your Facebook profile. If you want to avoid that 1puntocinco obtains this data, please modify your privacy settings or send an email requesting this to hello@15onzas.com. 1puntocinco does not obtain any proactively any other data considered as sensitive, and in that case it will be immediately deleted.
<br/>
3. Collection of personal data through Cookies and similar technologies<br/>
Our Website uses "Cookies". Cookies are small data archives stored in your computer or electronic communication device hard drive when browsing through our Website. These data archives allow us to exchange status information between our Website and the browser you use. The "status information" may reveal log in means, authentication means or your preferences as a user, as well as any other data stored in your browser regarding the Website.

Cookies allow us to monitor the behavior of a use on line. We use the information obtained through cookies to help us optimize the Website's settings and therefore improve your experience as a user (e.g.identifying from which country you are entering from and re-route it to the corresponding website). Through the use of cookies we can, for example, personalize in your favor our homepage in order for our screens to be deployed in a better way according to your browser type.

Like most websites, our serves register your IP address, the URL address from which you accessed to our Website, the browser type, the date and hour in which you execute activities. We use this information to manage the system and optimize your use of the Website.

Your browser will allow cookies and enable automatic collection of information unless you change the default browser settings. Most browsers allow you to manage your cookies preferences. You may adjust your browser to reject or delete cookies. The following links show how to adjust the browser setting of the most frequently used browsers:
<br/>
Chrome
Firefox
Safari
Internet Explorer
If you disable cookies from our Website, our Website may not charge properly and may not enable certain links.
<br/>
4. Use of third parties' cookies and web beacons<br/>
1puntocinco works with Facebook, Google Analytics, VIMEO and other service providers that use technology to help us deliver our own content, provide targeted publicity and obtain anonymous metrics and website analysis. In the corresponding agreement, we require to these companies to use the information they obtain only to provide us with the services we required. Even when these companies use some anonymous information about you to display ads, we contractually prohibit these companies from collecting personal data about you.

Many of our service providers participate in a NAI opt-out program. You have the option to opt-out from the use of such information for said purposes by clicking here. To opt out of Google Analytics click here.  We do not otherwise respond to browser Do Not Track signals at this time.
<br/>
5. Why do we use your personal data?<br/>
The collection and processing of your personal data is carried out for the following purposes:

a. Delivery of Newsletter, which includes personalized content, invitations, exclusive benefits, recommendations, publicity and sales, when chosen;
b. Perform marketing studies (e.g. referring to purchase frequencies, age, etc.) which will be conducted in a disaggregated manner; and
c. Monitoring and tracking of attendance and consumption, through our mobile applications, loyalty programs and e-commerce.
Subscribing to our news and publicity services is absolutely voluntary. We do not require to convey with publicity deliveries to keep and maintain our legal relationship we may have with you in a certain moment; therefore, you will always have the initial option to not subscribe to our publicity systems; also, you will have the possibility at all times to opt-out from our advertising, sales and publicity messages. To do this, you only have to choose the "opt-out" option that will be attached in each message you receive.
<br/>
6. With whom do we share your personal data?<br/>
1puntocinco may transfer its customer's personal data to other companies or authorities for the purposes set out in this Privacy Notice. These data transfers include the following:

a. Since 1puntocinco is part of an international group, your personal data may be communicated to other companies within the same corporate group, including our affiliates, which are located outside of Mexico. Our affiliates have implemented measures and policies for its customers' data protections; these policies result consistent with ours and try to comply with the provisions set out by the law in each country.
b. 1puntocinco may send all or a part of your personal data to service providers that support us with some data processing activities. These providers include: (i) technology companies that provide us with several communication or infrastructure services; and (ii) companies that provide us with publicity, logistics or loyalty program management services (iii) companies to whom we provide services of advertising, marketing and market intelligence, which can use your data for the same purposes described in section 5 of this Privacy Notice. In all these cases, 1puntocinco ensures that these service providers assume contractual obligations that allow our customers' personal data is protected.
c. Likewise, 1puntocinco may transfer its customers' personal data to administrative or judicial authorities, when the transfer is necessary or legally required when safeguarding a public interest, 1puntocinco's protection of rights, third parties' protection of rights or for the enforcement and administration of justice. Additionally, 1puntocinco may use or disclose your personal data when we consider, in good faith, that the applicable law allows us to use or disclose your data. This includes, for example, when such transfer is necessary in order to protect you, to answer to claims or protect 1puntocinco's property rights or security, its affiliates or third parties' rights.
d. Also, the customers' information may be communicated or transferred to a third party, in the course of a corporate transaction, including a merger or an assets sale or an acquisition.
e. In other cases, when permitted by the applicable law or when it is consented by you to perform the transfer.
Due to the international nature of 1puntocinco's operations, all the aforementioned transfers may be of national or international nature; likewise, all are precise in order to maintain or comply with the commercial relationship held between 1puntocinco and its customers and, therefore, we do not require consent from the customer in order to execute them. 1puntocinco does not lease nor sells personal data obtained from you to any third party.
<br/>
7. Which are your rights?<br/>
You have at all times the right to access and view the information we have about you: likewise, you have the right to require such information to be corrected or cancelled; you may oppose from [_1puntocinco__]'s use to your personal data for specific purposes and/or revoke at any time the consent you granted us from the processing of your personal data to the extent permitted by law. In order to exercise such rights or to ask any questions or complain in relation to the processing of your personal data please contact our Personal Data Department ("PDD"). Please address your request to hello@15onzas.com, in response to the "Head of the Personal Data Department ".

Your requests will be evaluated in the terms set out in the applicable laws. Our PDD will communicate you (i) the information required for your identification as well as the documents needed to be sent alongside your request; (ii) the time periods in which you will receive an answer to your request; (iii) how you should file your request, including the forms that you may use to file your request, if any, and; (iv) the form or means in which we will deliver you the information.
<br/>
8. What options do I have to limit the way in which 1puntocinco uses my personal data?<br/>
1puntocinco offers you choices regarding how we use your personal data; we offer you several means to inform us about your decision.

If you desire not to receive advertisement messages from us or cancel your subscription to our information services, you: (a) you may unsubscribe to our email lists by using the mechanism set out in our emails; (b) you may delete the 1puntocinco Media application in the applications tab in Facebook and (c) you may delete mobile applications powered by 1puntocinco in your mobile phone.
<br/>
9. Security Measures.<br/>
1puntocinco has adopted appropriate physical, organizational and technical security measurements in order to protect your personal data from lost and non-authorized use or access.
<br/>
10. Changes to the Privacy Notice<br/>
1puntocinco reserves the right to make changes or updates to this Privacy Notice at any time. The modified notice will be published in visible areas in our mobile applications and/or our website or will be sent to you via email. Our customers can verify that the Notice has been modified given that we will note the date of last update. In case that 1puntocinco performs any substantial change to your personal data processing, we will let you know through a notice sent to you via email or published in our Website. All changes performed to our privacy notice will be effective 30 calendar days after its publication. If you do not agree with the modifications, please contact our PDD.
        </Dialog>  
        </div> 
      </div>
     
    );
  }
}

export default Signup;