export interface LogEntry{
    id : string ; 
    correlationId : string;
    timestamp : number ; 
    level : 'info' | 'warn' | 'error';
    message : string ; 
    service : 'api' | 'db' | 'auth' | 'payments' | 'frontend';
}