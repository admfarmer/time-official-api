import * as knex from 'knex';

export class LoginModel {

  login(db: knex, username: string, password: string) {
    return db('person')
      .select(  'id as user_id', 'title as pname', 'name as fname', 'lastname as lname')
      .where({
        idcard: username,
        tell: password
    }).andWhereRaw('position in (3,6,7,11,13)');
    ;
  }

}