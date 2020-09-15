const create = async (user) => {
  try {
    let response = await fetch('/api/layers/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const list = async (signal) => {
  try {
    let response = await fetch('/api/layers/', {
      method: 'GET',
      signal: signal,
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/layers/' + params.layerId, {
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

const update = async (params, layer) => {
  try {
    let response = await fetch('/api/layers/' + params.layerId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(layer)
    });
    return await response.json()
  } catch(err) {
    console.log(err)
  }
};

const remove = async (params) => {
  try {
    let response = await fetch('/api/layers/' + params.layerId, {
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
  list,
  read,
  update,
  remove
}
