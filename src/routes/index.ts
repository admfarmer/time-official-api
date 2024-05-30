/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as http from 'http'

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  // fastify.get('/hello', async (req: fastify.Request, reply: fastify.Reply) => {
  //   req.log.info('hello');
  //   reply.send({ hello: 'world' });
  // })

  // fastify.get('/sign-token', async (req: Request, reply: fastify.Reply) => {
  //   const token = fastify.jwt.sign({ foo: 'bar' }, { expiresIn: '1d' });
  //   reply.send({ token: token });
  // })

  next();

}

module.exports = router;