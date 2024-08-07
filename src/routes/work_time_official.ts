/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment-timezone';

import { WorkTimeOfficialModel } from '../models/work_time_official';
import {Validate} from './validation'

const workTimeOfficialModel = new WorkTimeOfficialModel();
const validate = new Validate();


const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to Work Time Official !', version: '1.0 build 20190820-1' })
  });

  fastify.post('/profile', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log('Info Profile');
    let profile: any = req.body;
    let time_work: any = req.body.time_work;
    let topic:any;
    let topic_full:any= `timeofficial/full`;
    
    if(time_work){
      topic = `timeofficial/${time_work}`;
    }else{
      topic = `timeofficial`;
    }
    let _cid = validate.is_cid(profile.cid);


    if (_cid) {
      const rs: any = await workTimeOfficialModel.person_cid(db, profile.cid);

      if (!rs[0]) {
        // const topic = 'timeofficial';
        let info_msg = {
          info: 'กรุณาลงทำเบียนบุคลากรก่อน'
        }
        fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
        fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info_msg });
      } else {
        let info_data: any = await workTimeOfficialModel.select_cid(db, profile.cid);

        if (!info_data[0]) {
          let cid = profile.cid;
          let title = profile.title;
          let lname = profile.lname;
          let fname = profile.fname;
          let work_date_in = profile.work_date_in;

          let info_insert: any = {
            cid: cid,
            fullname: `${title}${fname} ${lname}`,
            work_date_in: moment(work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
            work_date_out: '0000-00-00 00:00:00',
            status: '0'
          }

          let info_msg: any = {
            msg: [
              {
                cid: cid,
                fullname: `${title}${fname} ${lname}`,
                work_date_in: moment(work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                work_date_out: '0000-00-00 00:00:00',
                status: '0'
              }
            ]
          }

          try {
            let rs: any = await workTimeOfficialModel.save(db, info_insert);
            // const topic = 'timeofficial';

            fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
            fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info_insert, });

          } catch (error) {
            fastify.log.error(error);
            reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
          }
        } else {

          let work_date_out = profile.work_date_out;
          let x = info_data[0];
          console.log(x.cid);


          let info_update: any = {
            work_date_out: moment(work_date_out).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
          }

          try {
            let rs: any = await workTimeOfficialModel.update(db, x.id, info_update);

            let info_: any = {
              cid: x.cid,
              fullname: x.fullname,
              work_date_in: moment(x.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
              work_date_out: info_update.work_date_out,
              status: x.status,
            }
            // console.log(info_);
            let info_msg: any = {
              msg: [
                {
                  cid: x.cid,
                  fullname: x.fullname,
                  work_date_in: moment(x.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                  work_date_out: info_update.work_date_out,
                  status: x.status,
                }
              ]
            }

            // const topic = 'timeofficial';

            fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
            fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info_, });

          } catch (error) {
            fastify.log.error(error);
            reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
          }
        }
      }
    }
  });

  fastify.post('/scan_profile', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log('Info Scan Profile');
    let profile: any = req.body;
    let time_work: any = req.body.time_work;
    let topic:any;
    let topic_full:any= `timeofficial/full`;
    
    if(time_work){
      topic = `timeofficial/${time_work}`;
    }else{
      topic = `timeofficial`;
    }

    let _cid = validate.is_cid(profile.cid);

    if (_cid) {
      const rs: any = await workTimeOfficialModel.person_cid(db, profile.cid);

      console.log(rs);
      
      if (!rs[0]) {
        // const topic = 'timeofficial';
        let info_msg = {
          info: 'กรุณาลงทำเบียนบุคลากรก่อน'
        }
        fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
        fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info_msg });
      } else {
        let info_data: any = await workTimeOfficialModel.select_cid(db, profile.cid);

        if (!info_data[0]) {
          let cid = profile.cid;
          let title = rs[0].title;
          let lname = rs[0].lastname;
          let fname = rs[0].name;
          let work_date_in = new Date();

          let info_insert: any = {
            cid: cid,
            fullname: `${title}${fname} ${lname}`,
            work_date_in: moment(work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
            work_date_out: '0000-00-00 00:00:00',
            status: '0'
          }

          let info_msg: any = {
            msg: [
              {
                cid: cid,
                fullname: `${title}${fname} ${lname}`,
                work_date_in: moment(work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                work_date_out: '0000-00-00 00:00:00',
                status: '0'
              }
            ]
          }

          try {
            let rs: any = await workTimeOfficialModel.save(db, info_insert);
            // const topic = 'timeofficial';

            fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
            fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info_insert, });

          } catch (error) {
            fastify.log.error(error);
            reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
          }
        } else {

          let work_date_out = new Date();
          let x = info_data[0];
          console.log(x.cid);


          let info_update: any = {
            work_date_out: moment(work_date_out).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
          }

          try {
            let rs: any = await workTimeOfficialModel.update(db, x.id, info_update);

            let info_: any = {
              cid: x.cid,
              fullname: x.fullname,
              work_date_in: moment(x.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
              work_date_out: info_update.work_date_out,
              status: x.status,
            }
            // console.log(info_);
            let info_msg: any = {
              msg: [
                {
                  cid: x.cid,
                  fullname: x.fullname,
                  work_date_in: moment(x.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                  work_date_out: info_update.work_date_out,
                  status: x.status,
                }
              ]
            }

            // const topic = 'timeofficial';

            fastify.mqttClient.publish(topic, JSON.stringify(info_msg), { qos: 0, retain: false });
            fastify.mqttClient.publish(topic_full, JSON.stringify(info_msg), { qos: 0, retain: false });
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info_, });

          } catch (error) {
            fastify.log.error(error);
            reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
          }
        }
      }
    }
  });
  
  fastify.delete('/profile', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log('claer profile')

    const profile: any = {}
    console.log(profile);

  });

  fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await workTimeOfficialModel.list(db);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "id": x.id,
          "cid": x.cid,
          "fullname": x.fullname,
          "work_date_in": x.work_date_in,
          "work_date_out": x.work_date_out,
          "status": x.status          
        }
        await info.push(data);
      }
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  //select_date?work_sdate=xxxx&work_edate=xxx
  fastify.get('/select_date', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let work_sdate = req.query.work_sdate
    let work_edate = req.query.work_edate
    try {
      
      if(validate.is_date(work_sdate) && validate.is_date(work_edate)){
        const rs: any = await workTimeOfficialModel.select_date(db, work_sdate, work_edate);
        let info: any = [];
        for(let x of rs) {
          let data:object = {
            "id": x.id,
            "cid": x.cid,
            "fullname": x.fullname,
            "work_date_in": x.work_date_in,
            "work_date_out": x.work_date_out,
            "status": x.status          
          }
          await info.push(data);
        }
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });
      }else{
        reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate work_sdate Or work_edate false'}, });   
      }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })
  fastify.post('/infoCid', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const cid: any = req.body.cid
    try {
      if(validate.is_cid(cid)){
          const rs: any = await workTimeOfficialModel.info_cid(db, cid);
          let info: any = [];
          for(let x of rs) {
            let data:object = {
              "id": x.id,
              "cid": x.cid,
              "fullname": x.fullname,
              "work_date_in": x.work_date_in,
              "work_date_out": x.work_date_out,
              "status": x.status          
            }
            await info.push(data);
          }
          reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });
        }else{
          reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate cid false'}, });   
        }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/infoWorkDate', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const work_date: any = req.body.work_date

    try {
      if(validate.is_date(work_date)){
        const rs: any = await workTimeOfficialModel.info_work_date(db, work_date);
        let info: any = [];
        for(let x of rs) {
          let data:object = {
            "id": x.id,
            "cid": x.cid,
            "fullname": x.fullname,
            "work_date_in": x.work_date_in,
            "work_date_out": x.work_date_out,
            "status": x.status          
          }
          await info.push(data);
        }
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });
      }else{
        reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate date false'}, });   
      }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/save', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const datas: any = {
      cid: req.body.cid,
      fullname: req.body.fullname,
      work_date_in: moment(req.body.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      work_date_out: moment(req.body.work_date_out).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      status: status || '0'
    };

    try {
      await workTimeOfficialModel.save(db, datas);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/update/:ID', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const ID: any = req.params.ID
    const datas: any = {
      cid: req.body.cid,
      fullname: req.body.fullname,
      work_date_in: moment(req.body.work_date_in).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      work_date_out: moment(req.body.work_date_out).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      status: status || '0'
    };

    try {
      await workTimeOfficialModel.update(db, ID, datas);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/delete/:ID', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const ID: any = req.params.ID
    try {
      await workTimeOfficialModel.remove(db, ID);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/personCid', async (req: fastify.Request, reply: fastify.Reply) => {
    const cid: any = req.body.cid
    console.log(cid);
    
    try {
      if(validate.is_cid(cid)){
        const rs: any = await workTimeOfficialModel.person_cid(db, cid);
        let info: any = [];
        for(let x of rs) {
          let data:object = {
            "idcard": x.idcard,
            "title": x.title,
            "name": x.name,
            "lastname": x.lastname      
          }
          await info.push(data);
        }
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });  
      }else{
        reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate cid false'}, });   
      }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/select_cid', async (req: fastify.Request, reply: fastify.Reply) => {
    const cid: any = req.body.cid
    console.log(cid);
    
    try {
      if(validate.is_cid(cid)){
        const rs: any = await workTimeOfficialModel.select_cid(db, cid);
        let info: any = [];
        for(let x of rs) {
          let data:object = {
            "id": x.id,
            "cid": x.cid,
            "fullname": x.fullname,
            "work_date_in": x.work_date_in,
            "work_date_out": x.work_date_out,
            "status": x.status          
          }
          await info.push(data);
        }
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: info, });
        } else {
          reply.status(HttpStatus.OK).send({ statusCode: 201, info: {error:'validate cid false'}, });   
        }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })
  next();
}

module.exports = router;