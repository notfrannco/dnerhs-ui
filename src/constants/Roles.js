const RolesMap = {
    ROLE_ADMIN: {
        name: "ROLE_ADMIN",
        description: "Administrador",
    },
    ROLE_USER: { name: "ROLE_USER", description: "Responsable Institución Formadora" },
    ROLE_DNERHS: { name: "ROLE_DNERHS", description: "DNERHS " },
    ROLE_RESPONSABLE_ESTABLECIMIENTO: {
        name: "ROLE_RESPONSABLE_ESTABLECIMIENTO",
        description: "Responsable Establecimiento",
    },
};

const getRoleDescription = (role) => {
    return RolesMap[role?.descripcion]?.description
}

export default {
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_USER: "ROLE_USER",
    ROLE_DNERHS: "ROLE_DNERHS",
    ROLE_RESPONSABLE_ESTABLECIMIENTO: "ROLE_RESPONSABLE_ESTABLECIMIENTO"
}

export {
    getRoleDescription
}
