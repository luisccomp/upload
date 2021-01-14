const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test'? '.env.test' : '.env'
});

function filename(req, file, cb) {
  // Criando um hash para criar um nome de arquivo. Isso garante que, se
  // duas pessoas subirem arquivos com o mesmo nome, as duas imagens não
  // se sobrepõe.
  crypto.randomBytes(16, (err, hash) => {
    if (err)
      cb(err);

    // Usando o hash para gerar nomes aleatórios para os arquivos enviados
    // pelos usuários.
    // const fileName = `${hash.toString('hex')}-${file.originalname}`;
    file.key = `${hash.toString('hex')}-${file.originalname}`;

    cb(null, file.key);
  });
}

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      // Criando um hash para criar um nome de arquivo. Isso garante que, se
      // duas pessoas subirem arquivos com o mesmo nome, as duas imagens não
      // se sobrepõe.
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err);
        }

        // Usando o hash para gerar nomes aleatórios para os arquivos enviados
        // pelos usuários.
        // const fileName = `${hash.toString('hex')}-${file.originalname}`;
        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      });
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'uploadexampleluisccomp',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      // Criando um hash para criar um nome de arquivo. Isso garante que, se
      // duas pessoas subirem arquivos com o mesmo nome, as duas imagens não
      // se sobrepõe.
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err);
        }

        // Usando o hash para gerar nomes aleatórios para os arquivos enviados
        // pelos usuários.
        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
}

// module.exports = {
//   dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
//     },
//     filename: (req, file, cb) => {
//       // Criando um hash para criar um nome de arquivo. Isso garante que, se
//       // duas pessoas subirem arquivos com o mesmo nome, as duas imagens não
//       // se sobrepõe.
//       crypto.randomBytes(16, (err, hash) => {
//         if (err) {
//           cb(err);
//         }
// 
//         // Usando o hash para gerar nomes aleatórios para os arquivos enviados
//         // pelos usuários.
//         const fileName = `${hash.toString('hex')}-${file.originalname}`;
// 
//         cb(null, fileName);
//       });
//     }
//   }),
//   limits: {
//     fileSize: 2 * 1024 * 1024
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = [
//       'image/jpeg',
//       'image/pjpeg',
//       'image/png',
//       'image/gif'
//     ];
// 
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type.'));
//     }
//   }
// };