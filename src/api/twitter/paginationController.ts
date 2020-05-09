import Twitter from 'twitter';

export default class PaginationController {
    public static setPaginationParams(params: Twitter.RequestParams) {
        if(params.next_results){
            // Find max_id and attach to params
            let max_id = this.getParameterFromQueryString(params.next_results, 'max_id');
            params.max_id = max_id;
            
            // remove unnecessary property
            delete params.next_results;
        }

        else if(params.refresh_url){
            // Find since_id and attach to params
            let since_id = this.getParameterFromQueryString(params.refresh_url, 'since_id');
            params.since_id = since_id;

            // remove unnecessary property
            delete params.refresh_url;
        }

        return params;
    }

    public static getParameterFromQueryString(query: string, qParam: string): string{
        // query example- ?max_id=1258403184457867264&q=%23webdevelopment&count=5
        let paramLen = qParam.length

        // get the index of parameter and forward its length
        // also forward the '='
        let start_index = query.indexOf(qParam) + paramLen + 1;
        
        // ignore the query before the start_index
        query = query.slice(start_index, query.length);
        start_index = 0;

        // now query starts with param value. Get the position of '&'
        let stop_index = query.indexOf('&');

        // parameter value is from start to stop index
        return query.slice(start_index, stop_index);
    }
};