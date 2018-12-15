//production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function googleUser(userData){
    return fetch(baseURL + '/auth/google', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(user=>{
        localStorage.setItem('user', JSON.stringify(user))
        return user;
    });
}
export function googleUserLogin(userData){
  return fetch(baseURL + '/auth/login/google', {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(user=>{
      localStorage.setItem('user', JSON.stringify(user))
      return user;
  });
}
export function signup(userData){
    return fetch(baseURL + '/auth/signup', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(user=>{
        localStorage.setItem('user', JSON.stringify(user))
        return user;
    });
}
export function login(userData){
    return fetch( baseURL + '/auth/login' ,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(userData),
      credentials: "include"
    })
    .then(res=>{
      if(!res.ok) return Promise.reject(res)
      return res.json();
    })
    .then(user=>{
      localStorage.setItem('user',JSON.stringify(user));
      return user;
    })
  }
export function salir(){
  return fetch( baseURL + '/auth/logout' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return 
  })
  .then(logoutUser=>{
    return 'Saliste'
  })
}
export function getSingleUser(id){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/auth/profile/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}

export function editProfile(formulario,id){
  return fetch(  baseURL + '/auth/profile/' + id ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formulario),
    credentials:"include"
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}

//ENVIAR MENSAJES DE CONFIRMACIÓN

export function sendEmailConfirmation(body,id){
  return fetch(  baseURL + '/confirm/email/' + id ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials:"include"
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(r=>{
    return r
  })
}

// RECUPERAR CONTRASEÑA
export function getNewPassword(correo){
  return fetch(  baseURL + '/auth/password/',{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(correo),
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}

// CAMBIAR CONTRASEÑA
export function changePassword(body){
  return fetch(  baseURL + '/auth/password/pwa',{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials:"include"
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}