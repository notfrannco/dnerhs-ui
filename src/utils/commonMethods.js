import DnerhsApi from "../api/DnerhsApi";

/**
 * Función a utilizar para realizar la descarga de archivos del servidor.
 * @param {*} endpoint
 * @param {*} params
 * @param {*} filename
 * @param {*} autoprint
 */
const downloadFile = async (endpoint, filename, autoprint) => {
  const file = await DnerhsApi.get(endpoint, {
    timeout: 120000,
    responseType: "blob",
  });
  const { userAgent } = navigator;
  
  const dataType = file.data.type;

  if (
    autoprint &&
    userAgent.indexOf("Chrome") > -1 &&
    dataType === "application/json"
  ) {
    //Create a Blob from the PDF Stream
    const src = new Blob([file.data], { type: "application/pdf" });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(src);
    //Open the URL on new Window
    const pdfWindow = window.open();
    pdfWindow.location.href = fileURL;
  } else {
    const downloadUrl = window.URL.createObjectURL(
      new Blob([file.data], { type: dataType })
    );
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

/**
 * Función que suma a la fecha date pasada como parametro days dias habiles retornando
 * la fecha resultante como un objeto momentjs.
 * @param {*} date
 * @param {*} days
 */
/* const addWeekdays = (date, days) => {
  date = moment(date);
  while (days > 0) {
    date = date.add(1, 'days');
    if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
      days -= 1;
    }
  }
  return date;
}; */

const methods = {
  //addWeekdays,
  downloadFile,
};

export default methods;
