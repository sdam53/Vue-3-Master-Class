/**
 * Type declaration for fetchItem's options
 */
export default interface FetchItemOptionsType {
    handleUnsubscribe?: (fun: any) => void; //function to handle special cases. defaults to null
    once?: boolean; //whether to have the listener keep running or remove it once item is retrieved
    onSnapshot?: (func: any) => void; //call back function when snapshot goes off
}
