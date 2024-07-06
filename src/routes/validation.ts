export class Validate {
    is_cid(cid:string){
        let regEx = /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;
        if (!cid.match(regEx)) return false;  // Invalid format
        return true;
    }
    is_tell(tell:string){
        let regEx = /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;
        if (!tell.match(regEx)) return false;  // Invalid format
        return true;
    }
    is_date(date: string) {
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!date.match(regEx)) return false;  // Invalid format
        let d = new Date(date);
        let dNum = d.getTime();
        if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0, 10) === date;
    }

    is_time(time: string) {
        let regEx = /^\d{2}:\d{2}:\d{2}$/;
        if (!time.match(regEx)) return false;  // Invalid format
        let d = new Date(time);
        let dNum = d.getTime();
        if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(11, 19) === time;
    }

    is_datetime(datetime: string) {
        let regEx = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!datetime.match(regEx)) return false;  // Invalid format
        let d = new Date(datetime);
        let dNum = d.getTime();
        if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0, 19) === datetime;
    }

    is_year(year: string) {
        let regEx = /^[0-9][0-9][0-9][0-9]$/;
        if (!year.match(regEx)) return false;  // Invalid format
        return true;
    }

    is_region(region: number) {
        
        if (region < 1 && region > 13) return false;  // Invalid format
        return true;
    }

    is_province(province: string) {
        let regEx = /^[0-9][0-9]$/;
        if (!province.match(regEx)) return false;  // Invalid format
        return true;
    }

    is_district(ampur: string) {
        let regEx = /^[0-9][0-9]$/;
        if (!ampur.match(regEx)) return false;  // Invalid format
        return true;
    }

    is_hospcode(hospcode: string) {
        let regEx = /^[[0-9][0-9][0-9][0-9][0-9]$/;
        if (!hospcode.match(regEx)) return false;  // Invalid format
        return true;
    }

    is_refer_no(refer_no: string) {
        let hospcode = refer_no.split('-')[0];
        let refer_type = refer_no.split('-')[1];
        let no = refer_no.split('-')[2];
        let regEx1 = /^[0-9][0-9][0-9][0-9][0-9]$/;
        let regEx2 = /^[1-4]$/;
        if (!hospcode.match(regEx1) && !refer_type.match(regEx2) && no.length < 10) return false;  // Invalid format
        return true;
    }

} 