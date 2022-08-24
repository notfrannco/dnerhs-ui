const formatToLocale = (number) => {
   return new Intl.NumberFormat("es-PY").format(number)
}

export {
    formatToLocale
}