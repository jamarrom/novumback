const express = require("express");
const router = express();
const http = require('http');
const cors = require('cors');

// const https = require('https');
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const fakeLocal = require('./fakeLocal.json');

// var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');

// const JWTStrategy = require('passport-jwt').Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config();

router.use(express.static('public'));
router.use(express.urlencoded({ extended:false }));
router.use(express.json());
router.use(cors());


router.get('/', async (req,res,next) => {
  const listaTipos = await prisma.typesusers.findMany({
    select: {
      typeuser_id: true,
      typeuser: true
    },
  });

  res.json({listaTipos});
});



router.post('/crearUsuario', async (req,res, next) => {
  //let fecha = new Date().toISOString();
  const nuevoUsuario = await prisma.users.create({
    data:{
      email: req.body.hdEmail,
      password: req.body.hdContrasenia,
      typeuser_id : 2,
      activo: 1
    }
  });

  res.json({"usuario_id":nuevoUsuario.user_id});
});




router.post('/crearCliente', async (req,res, next) => {
  let fecha = new Date().toISOString();
  const nuevoCliente = await prisma.clientes.create({
    data:{
      nombre: req.body.hdNombre,
      apellido: req.body.hdApellido,
      puesto: req.body.hdPuesto,
      celular: req.body.hdCelular,
      empresa: req.body.hdEmpresa,
      dedica_empresa: req.body.hdDedica,
      num_empleados: parseInt(req.body.hdNumEmpleados),
      fecha:fecha,
      user_id: req.body.hdUser_id,
      activo: 1
    }
  });

  res.json({"cliente_id":nuevoCliente.cliente_id});
});



router.post('/altaCajaBanco', async (req,res, next) => {
  //let fecha = new Date().toISOString();
  const nuevoCajaBanco = await prisma.cajas_bancos.create({
    data:{
      nombre_cuenta: req.body.txtNombre,
      tipo_pago_id : parseInt(req.body.stTipo),
      cantidad_actual:  parseInt(req.body.txtCantidadActual),
      user_id:  parseInt(req.body.user_id),
      activo: 1
    }
  });

  res.json({"cajas_bancos_id":nuevoCajaBanco.cajas_bancos_id});
});




router.post('/altaIngresoFuturo', async (req,res, next) => {
  let fecha = new Date(req.body.txtFechaTentativaCobro+' 00:00:00').toISOString();
  const nuevoIngresoFuturo = await prisma.ingresos_futuros.create({
    data:{
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_cobro: fecha,
      user_id: parseInt(req.body.user_id),
      activo: true
    }
  });

  res.json({"ingresos_futuros_id":nuevoIngresoFuturo.ingresos_futuros_id});
});



router.post('/altaEgresoFuturo', async (req,res, next) => {
  let fecha = new Date(req.body.txtFechaTentativaPago+' 00:00:00').toISOString();
  const nuevoEgresoFuturo = await prisma.egresos_futuros.create({
    data:{
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_pago: fecha,
      user_id: parseInt(req.body.user_id),
      activo: true
    }
  });

  res.json({"egresos_futuros_id":nuevoEgresoFuturo.egresos_futuros_id});
});


router.post('/loguear', async (req,res, next) => {
  try{
    let user = await findUser(req.body.email,req.body.password);
    res.json({"usuario_id":user});
  }catch(e) {
    res.json({"usuario_id":0});
  }
});

async function findUser(email,password) {
  const users = await prisma.users.findFirst({
    where: {
      email,
      password
    },
    select: {
      user_id:true
    }});

    if(users == null)
      return 0;

    return users.user_id;
}

// router.get('/admin',passport.authenticate('jwt', { failureRedirect : '/', session: false }), async (req,res,next) => {
//   const listClientes = await prisma.clientes.findMany({});
//   res.render("admin",{listClientes});
// });

// router.get('/admin/alta-cliente',passport.authenticate('jwt', { failureRedirect : '/', session: false }), (req,res,next) => {
//   let message = "";
//   res.render("alta-cliente",{message});
// });

// router.post('/admin/alta-cliente',passport.authenticate('jwt', { session: false }), async (req,res, next) => {
//   let fecha = new Date().toISOString();

//   const nuevoCliente = await prisma.clientes.create({
//     data:{
//       nombre: req.body.txtNombre,
//       apellidos: req.body.txtApellidos,
//       email: req.body.txtEmail,
//       telefono: req.body.txtTelefono,
//       user_id: req.user,
//       fecha: fecha,
//       activo: 1
//     }
//   });

//   let message = "Guardado";
//   res.render("alta-cliente",{message});
// });


// router.get('/admin/editar-cliente/:id',passport.authenticate('jwt', { failureRedirect : '/', session: false }), async (req,res,next) => {
//   let message = "";
//   const { id } = req.params;

//   const cliente = await prisma.clientes.findFirst({
//     where: {
//       cliente_id : parseInt(id)
//     },
//     select: {
//       nombre: true,
//       apellidos: true,
//       telefono: true,
//       email: true
//     }
//     });

//   console.log(cliente);
//   res.render("editar-cliente",{message,cliente});
// });



// Servidor HTTP
// const serverHttp = http.createServer(router);
// serverHttp.listen(process.env.HTTP_PORT, process.env.IP);
// serverHttp.on('listening', () => console.info(`Notes App running at http://${process.env.IP}:${process.env.HTTP_PORT}`));
router.listen(3002, () => {
  console.log("Aplicación ejecutandose ....");
});



// Servidor HTTP
// const httpsServer = https.createServer(options, router);
// httpsServer.listen(443, process.env.IP);

