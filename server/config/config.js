//====================
//Puerto
//====================

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV|| 'dev';

//vencimiento de token
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// SEED DE AUTENTICACION
process.env.SEED = process.env.SEED || 'ANITA-LAVA-LA-TINA-DESARROLLO';

let urlDB;

if (process.env.NODE_ENV ==='dev'){
    urlDB ='mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB =urlDB;

process.env.CLIENT_ID = process.env.CLIENT_ID || '225356611382-antpn8otngr85vh4lhcvg9hr72v03df0.apps.googleusercontent.com'
