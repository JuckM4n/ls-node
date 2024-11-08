export const userDto = ({
    _id,
    username,
    surName,
    firstName,
    middleName,
    image,
    permission,
    password
}) => {
    return {
        id: _id ? _id : null,
        username,
        surName,
        firstName,
        middleName,
        password,
        image: image ? image :'https://icons-for-free.com/iconfiles/png/512/profile+user+icon-1320166082804563970.png',
        permission: permission ? permission : {
          chat: { C: true, R: true, U: true, D: true },
          news: { C: true, R: true, U: true, D: true },
          settings: { C: true, R: true, U: true, D: true },
        },
      }
}