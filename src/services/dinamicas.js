//production 
const baseURL = process.env.REACT_APP_BASE_URL;
// development
//const baseURL = "http://localhost:3000"

export function getDinamics(idCentro){
  return fetch( baseURL + '/dinamica/pwa/' + idCentro )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamicas=>{
    return dinamicas
  })
}

export function getSingleDinamic(id) {
  return fetch( baseURL + '/dinamica/' + id)
  .then(r=>r.json())
  .then(dinamic=>{
    return dinamic
  })
}
export function sendWinner(dinamica,id){
  return fetch(baseURL + '/dinamica/winner/' + id , {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(dinamica)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(dinamica=>{
      return dinamica;
  });
}
