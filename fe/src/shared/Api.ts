import axios, { AxiosPromise, AxiosResponse, Method } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// *** Constants and variables ***
const baseUrl = process.env.REACT_APP_LOCAL_HOST;

// local utility type
export type SetState<T> = Dispatch<SetStateAction<T>>;

// *** Functions ***

/*
 * Custom Hook used each time the page is called up
 *
 * @param method [Method]         - http method
 * @param path [string]           - relative path to baseUrl
 * @param payload [json object]   - optional data to be sent in case of POST
 * @return, Response Data         - 2 data sets to be destructured
 */
export function useApi<T> (method: Method, path: string, payload = {} )
                          : [T | undefined, SetState<T | undefined>, T | undefined, SetState<T | undefined>] {

  const [data, setData]               = useState<T>();
  const [totalPages, setTotalPages]   = useState<T>();

  useEffect(() => {
    apiSimple(method, path, payload)
    .then(res=>{
      console.log("returnData ", res)
      setData(res.data.data)
      setTotalPages(res.data.recordsTotal)
    })
  }, [path]);

  return [data, setData, totalPages, setTotalPages];
}

/*
 * Custom Hook with if condition before requesting data:
 *
 * - default state is an empty array[], so the map function in jsx is not stuck
 * - an if condition within the useEffect was added, which causes the useApi2 to 
 * wait till the condition arrives
 *
 * @param path      [string]  : relative path to baseUrl
 * @param condition [string]  : Api2 will wait till condition is fulfilled
 * @return, Response Data
 */
export function useApi2<T>(path: string, condition: string)
                          : [T[] , SetState<T[] >] {
  
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {

    console.log("condition: ",condition);
    
    if(condition) api("GET", path, setData);
  }, [condition]);

  return [data, setData];
}

/*
 * Api to be called mainly from event handlers
 *
 * @param   method  [Method]  - http method
 * @param   path    [string]  - relative path to baseUrl
 * @param   data    [function]- callback, gets `response.data` as an argument
 * @param   data    [object]  - body data
 * @return  data    [function]- Response Data
 */
export function api<T>(
  method: Method,
  path: string,
  callback: (data: T) => void,
  data = {}
): void {
  const url = `${baseUrl}/${path}`;
  console.log("url: ", url);


  
  axios({
    method: method,
    url: `${baseUrl}/${path}`,
    data,
  }).then((raw: any) =>{
    console.log("res: ", raw.data)

    return {customers: raw.data.data, 
            totalPages: raw.data.recordsTotal};
  });
}

/**
 * Simplified API which returns data directly to calling function. Return data to
 * be extracted with promise chain ".then" 
 * 
 * @param   method  [Method]  - http method
 * @param   path    [string]  - relative path to baseUrl
 * @param   data    [object]  - body data
 * @return  data    [Promise] - Promise chain ".then"
 */
export function apiSimple<T>(
  method: Method,
  path: string,
  data = {}
): AxiosPromise {

  const url = `${baseUrl}/${path}`;
  console.log("url: ", url);
  console.log("data: ", data)
  
  return axios({
    method,
    url: `${baseUrl}/${path}`,
    data,
  })
}
