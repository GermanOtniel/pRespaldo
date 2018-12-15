//production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function getNotas(id){
  return fetch( baseURL + '/nota/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(nota=>{
    return nota
  })
}

export function deleteNote(idMessage,body){
  return fetch(  baseURL + '/nota/remove/' + idMessage ,{
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
  .then(nota=>{
    return nota
  })
}