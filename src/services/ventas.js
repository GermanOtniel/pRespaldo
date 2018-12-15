//production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function getVentas(user){
  return fetch( baseURL + '/ventas/' + user )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(ventas=>{
    return ventas
  })
}

export function getVentasByDinamicAndUser(id,idUser){
  return fetch(baseURL + '/ventas/dinamica/' + id + '?user=' + idUser, {
    method:'GET',
    headers:{
        "Content-Type": "application/json"
    }
})
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(ventas=>{
      return ventas;
  });
}