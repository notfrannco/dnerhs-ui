const Meses = [
    {
      "id": 1,
      "nombre": "Enero",
      "abrev": "Ene"
    },
    {
      "id": 2,
      "nombre": "Febrero",
      "abrev": "Feb"
    },
    {
      "id": 3,
      "nombre": "Marzo",
      "abrev": "Mar"
    },
    {
      "id": 4,
      "nombre": "Abril",
      "abrev": "Abr"
    },
    {
      "id": 5,
      "nombre": "Mayo",
      "abrev": "May"
    },
    {
      "id": 6,
      "nombre": "Junio",
      "abrev": "Jun"
    },
    {
      "id": 7,
      "nombre": "Julio",
      "abrev": "Jul"
    },
    {
      "id": 8,
      "nombre": "Agosto",
      "abrev": "Ago"
    },
    {
      "id": 9,
      "nombre": "Setiembre",
      "abrev": "Set"
    },
    {
      "id": 10,
      "nombre": "Octubre",
      "abrev": "Oct"
    },
    {
      "id": 11,
      "nombre": "Noviembre",
      "abrev": "Nov"
    },
    {
      "id": 12,
      "nombre": "Diciembre",
      "abrev": "Dic"
    }
  ]

  const findById = (id) => {
    return Meses.find(mes => mes.id == id);
  }

  export {Meses, findById}