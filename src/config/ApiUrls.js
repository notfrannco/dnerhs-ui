const REPORT_API_PROTOCOL = process.env.REACT_APP_DNERHS_REPORTES_PROTOCOL;
const REPORT_API_HOST = process.env.REACT_APP_DNERHS_REPORTES_HOST;

const ReporteApi = {
  baseURL: `${REPORT_API_PROTOCOL}://${REPORT_API_HOST}/`,
};

export { ReporteApi };