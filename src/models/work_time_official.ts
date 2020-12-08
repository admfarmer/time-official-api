import * as Knex from 'knex';

export class WorkTimeOfficialModel {
  tableName: string = 'work_time_official';

  list(db: Knex) {
    return db(this.tableName).orderBy('work_date_in', 'DESC')
  }

  async select_date(db: Knex, work_sdate: any, work_edate: any) {
    let datas = await db.raw(`SELECT * from ${this.tableName} where date(work_date_in) between '${work_sdate}' and '${work_edate}' order by work_date_in DESC`);
    return datas[0];
  }

  info_cid(db: Knex, cid: any) {
    return db(this.tableName)
      .where('cid', cid);
  }

  select_cid(db: Knex, cid: any) {
    return db(this.tableName)
      .where('cid', cid)
      .andWhere('work_date_out', '0000-00-00 00:00:00');
  }

  info_work_date(db: Knex, work_date_in: any) {
    return db(this.tableName)
      .where('work_date_in', work_date_in);
  }

  save(db: Knex, datas: any) {
    console.log('save', datas);

    return db(this.tableName).insert(datas);
  }

  update(db: Knex, ID: any, datas: any) {
    console.log('update :', datas, ' id :', ID);
    let work_date_out = datas.work_date_out;

    return db(this.tableName)
      .where('id', ID)
      .update('work_date_out', work_date_out);
  }

  remove(db: Knex, ID: any) {
    return db(this.tableName)
      .where('id', ID)
      .update('status', '1')
  }


  person_cid(db: Knex, cid: any) {
    return db('person').select('idcard', 'title', 'name', 'lastname')
      .where('cid', cid);
  }
}