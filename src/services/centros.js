//production 
const baseURL = process.env.REACT_APP_BASE_URL;
// development
//const baseURL = "http://localhost:3000"
export function getCenters(){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/ctrconsumo/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(centros=>{
    return centros
  })
}