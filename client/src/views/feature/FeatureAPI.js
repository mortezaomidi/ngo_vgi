const create = async (feature) => {
  try {
    let response = await fetch('/api/features/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feature)
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const listFeature = async (signal) => {
  try {
    let response = await fetch('/api/features/', {
      method: 'GET',
      signal: signal,
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const readFeature = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/features/' + params.featureId, {
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

const update = async (params, feature) => {
  try {
    let response = await fetch('/api/features/' + params.featureId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feature)
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const remove = async (params) => {
  try {
    let response = await fetch('/api/features/' + params.featureId, {
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
  create,
  listFeature,
  readFeature,
  update,
  remove
}
