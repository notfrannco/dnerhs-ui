
import { toast } from "react-toastify";
import ResponseUtils from "utils/ResponseUtils";

const DEFAULT_MESSAGE_ERROR = "Ocurrió un error inesperado, por favor vuelva a intentar."

const show = ({
    message,
    type
}) => {

    switch (type) {
        case "error":
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            break;
        case "warning":
            toast.warn(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            break;
        case "success":
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            break;

        default:
            toast.info(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            break;
    }
}

const showServerError = (error) =>  {
    if (error.response) {
      let  message = ResponseUtils.getMessageError(error.response);
      if (!message) {
          message = DEFAULT_MESSAGE_ERROR;
      }
      show({
          message,
          type:"error"
      })
    }else {
      show({
          message : DEFAULT_MESSAGE_ERROR,
          type:"error"
      })
    }
   
  }

  const showError = (message) => {
      show({
          message,
          type : "error"
      })
  }

export default {
    show,
    showServerError,
    showError
}