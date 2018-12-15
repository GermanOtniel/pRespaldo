//production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function createEvidence(evidence){
    return fetch(baseURL + '/evidencia/new', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evidence)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(evidencia=>{
        return evidencia;
    });
}

export function getEvidencesByUser(user){
    return fetch( baseURL + '/evidencia/pwa/' + user )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(evidencias=>{
      return evidencias
    })
  }

  export function getEvidencesDesapByUser(user){
    return fetch( baseURL + '/evidencia/desaprobadas/' + user )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(evidencias=>{
      return evidencias
    })
  }

  export function getEvidencesByDinamic(id) {
    return fetch( baseURL + '/evidencia/dinamica/' + id)
    .then(r=>r.json())
    .then(evidencias=>{
      return evidencias
    })
  }

  export function getSingleEvidence(id) {
    return fetch( baseURL + '/evidencia/' + id)
    .then(r=>r.json())
    .then(evidencia=>{
      return evidencia
    })
  }

  export function editEvidence(evidencia,id){
    return fetch(  baseURL + '/evidencia/edit/' + id ,{
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(evidencia),
      credentials:"include"
  })
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(evidence=>{
      return evidence
    })
  }

  export function deleteEvidence(id){
    return fetch(baseURL + '/evidencia/delete/' + id , {
        method:'delete',
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(r=>{
        return r;
    });
  }