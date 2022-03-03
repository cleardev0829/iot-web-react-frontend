import mock from "../mock";
import axios from "axios";
import { API_URL } from "app/fuse-configs/endpointConfig";

mock.onGet(`/api/tableau-app/folders`).reply(() => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/folders`, {}).then((response) => {
      const data = response.data;
      resolve([200, data]);
    });
  });
});

mock.onPost("/api/tableau-app/remove-folders").reply((request) => {
  const { ids } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/folders/deleteByIds`, { ids }).then((response) => {
      const data = response.data;
      resolve([200, data]);
    });
  });
});

mock.onPost("/api/tableau-app/remove-folder").reply((request) => {
  const data = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/folders/${data.id}`, {}).then((response) => {
      const data = response.data;
      resolve([200, data]);
    });
  });
});

mock.onGet("/api/tableau-app/folder").reply((request) => {
  const { productId } = request.params;
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/folders/${productId}`, {}).then((response) => {
      const data = response.data;
      resolve([200, data]);
    });
  });
});

mock.onPost("/api/tableau-app/new-folder").reply((request) => {
  const data = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/folders/register`, {
        name: data.name,
        notes: data.notes,
        user: data.user,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/update-folder").reply((request) => {
  const data = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .put(`${API_URL}/folders/${data.id}`, {
        name: data.name,
        notes: data.notes,
        user: data.user.id,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      });
  });
});

/**
 * azure-blob-storage
 */
mock.onPost("/api/tableau-app/getBlobsInContainer").reply((request) => {
  const { containerName } = JSON.parse(request.data);

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/getBlobsInContainer`, {
        containerName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/deleteBlobInContainer").reply((request) => {
  const { containerName, fileName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/deleteBlobInContainer`, {
        containerName,
        fileName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/downloadBlobInContainer").reply((request) => {
  const { containerName, fileName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/downloadBlobInContainer `, {
        containerName,
        fileName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/uploadBlobInContainer").reply((request) => {
  const { containerName, file } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/uploadBlobInContainer `, {
        containerName,
        file,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/getBlobsInContainer").reply((request) => {
  const { containerName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/getBlobsInContainer `, {
        containerName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/createContainerInStorage").reply((request) => {
  const { containerName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/createContainerInStorage `, {
        containerName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/deleteContainerInStorage").reply((request) => {
  const { containerName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/deleteContainerInStorage `, {
        containerName,
      })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/listContainersInStorage").reply((request) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/listContainersInStorage`, {})
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

mock.onPost("/api/tableau-app/isExistsContainerInStorage").reply((request) => {
  const { containerName } = JSON.parse(request.data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/azure/isExistsContainerInStorage `, { containerName })
      .then((response) => {
        const data = response.data;
        resolve([200, data]);
      })
      .catch((err) => {
        reject(err);
      });
  });
});
