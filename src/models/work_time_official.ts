import * as Knex from 'knex';

export class WorkTimeOfficialModel {
  tableName: string = 'work_time_official';

  list(db: Knex) {
    return db(this.tableName).orderBy('work_date_in', 'DESC')
  }

  select_date(db: Knex, work_sdate: any, work_edate: any) {
    return db(this.tableName).whereBetween('work_date_in', [work_sdate, work_edate])
      .orderBy('work_date_in', 'DESC')
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
}