const createSpecs = async (params, layerSpecs) => {
  try {
    let response = await fetch('/api/layersSpecs/'+ params.layerId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(layerSpecs)
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const readSpecs = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/layersSpecs/' + params.layerId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const removeSpecs = async (params) => {
  try {
    let response = await fetch('/api/layersSpecs/' + params.layerSpecsId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const removeLayerSpecs = async (params) => {
  try {
    let response = await fetch('/api/layersSpecs/'+ params.layerId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

export {
  createSpecs,
  readSpecs,
  removeSpecs,
  removeLayerSpecs
}
