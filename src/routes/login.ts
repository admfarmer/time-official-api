/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import { LoginModel } from '../models/login';
import {Validate} from './validation'

const loginModel = new LoginModel();
const validate = new Validate();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.post('/', async (req: fastify.Request, reply: fastify.Reply) => {
    const body: any = req.body;

    const username = body.username;
    const password = body.password;

    try {
        if(validate.is_cid(username) && validate.is_tell(password)){
            const rs: any = await loginModel.login(db, username, password);
            if (!rs.length) {
              reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง' })
            } else {
              const info = rs[0];
            
              const token = fastify.jwt.sign({
                fullname: `${info.pname}${info.fname} ${info.lname}`,
                userId: info.user_id,
              }, { expiresIn: '1d' });
              reply.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK, token: token,
              });
            }
        }else{
        reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate username or password false'}, });   
      }

    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  next();

}

module.exports = router;