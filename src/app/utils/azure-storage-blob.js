// ./src/azure-storage-blob.ts

// <snippet_package>
// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

// THIS IS SAMPLE CODE ONLY - DON'T STORE TOKEN IN PRODUCTION CODE
const sasToken =
  process.env.storagesastoken ||
  "sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupix&se=2022-12-31T13:10:11Z&st=2022-01-31T05:10:11Z&spr=https&sig=CHgfCT%2FZpJQXb%2F%2B1s0xuiWVkQW7VP78eFFeIPtCXw8Q%3D"; // Fill string with your SAS token

const storageAccountName =
  process.env.storageresourcename || "rocketiotparserstorage"; // Fill string with your Storage resource name

// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};
// </snippet_isStorageConfigured>

// return list of blobs in container to display
export const getBlobsInContainer = async (containerName) => {
  console.log("getBlobsInContainer params", containerName);
  const returnedBlobUrls: string[] = [];
  const blobList = [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );

  // get list of blobs in container
  // eslint-disable-next-line
  let index = 0;
  for await (const blob of containerClient.listBlobsFlat()) {
    index++;

    // if image is public, just construct URL
    const blobUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`;
    returnedBlobUrls.push(blobUrl);

    blobList.push({
      id: index,
      name: blob.name,
      blobUrl: blobUrl,
      url: blobUrl,
      contentType: blob.properties.contentType,
      contentLength: blob.properties.contentLength,
      // createdOn: moment(blob.properties.createdOn),
      // lastModified: moment(blob.properties.lastModified),
      // lastAccessOn: moment(blob.properties.lastAccessOn)
    });
  }

  return blobList;
};

export const getBlobsInContainer1 = async (containerName) => {
  console.log("getBlobInContainer1:", containerName);
  const blobList = [];
  let count = 0;
  if (containerName === "tableau-mt42") count = 5;
  else if (containerName === "tableau-rt42") count = 10;
  else if (containerName === "tableau-displays") count = 15;

  for (var i = 0; i < count; i++) {
    blobList.push({
      id: i,
      name: `name${i}`,
      blobUrl:
        "https://res.cloudinary.com/hcti/image/fetch/c_limit,f_auto,q_auto:good,w_800/https://docs.htmlcsstoimage.com/assets/images/cat.png",
      url:
        "https://res.cloudinary.com/hcti/image/fetch/c_limit,f_auto,q_auto:good,w_800/https://docs.htmlcsstoimage.com/assets/images/cat.png",
    });
  }

  return blobList;
};

export const deleteBlobInContainer = async (containerName, fileName) => {
  console.log("deleteBlobInContainer params", containerName, fileName);
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const blobDeleteResponse = await blockBlobClient.delete();

  return blobDeleteResponse;
};

export const downloadBlobFromContainer = async (containerName, file) => {
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );
  const blockBlobClient = containerClient.getBlockBlobClient(file.name);
  const blobDownloadResponse = await blockBlobClient.download(0);

  fetch(file.blobUrl).then((response) => {
    response.blob().then((blob) => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
    });
  });

  return blobDownloadResponse;
};

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: File
) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadBrowserData(file, options);
};

const uploadFileToBlob = async (containerName, file): Promise<string[]> => {
  console.log("uploadFileToBlob params", containerName, file);
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );
  await containerClient.createIfNotExists({
    access: "container",
  });

  // upload file
  await createBlobInContainer(containerClient, file);

  const blobUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${file.name}`;
  return blobUrl;
};

export const deleteContainer = async (containerName) => {
  console.log("=============================deleteContainer", containerName);
  if (!containerName) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );
  const data = await containerClient.deleteIfExists({
    access: "container",
  });

  return data;
};

export default uploadFileToBlob;
