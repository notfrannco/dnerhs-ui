
const getMessageError = (response) => {
    let message = "";
    if (response) {
        let { data, status } = response;
        if (status === 406) {
            if (data.errors) {
                message = "Error de validación de datos \n "
                data.errors.forEach(msg => {
                    message += msg + " \n ";
                });
            }else {
                message = data.error;
            }
        }
    }

    return message;
}

export default {
    getMessageError
}