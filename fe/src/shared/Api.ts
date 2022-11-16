import axios, { AxiosPromise, AxiosResponse, Method } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// *** Constants and variables ***
const baseUrl = process.env.REACT_APP_LOCAL_HOST;

// local utility type
type SetState<T> = Dispatch<SetStateAction<T>>;

// *** Functions ***

/*
 * Useful for http data as a dependency in rendering
 *
 * @param method [Method] - http method
 * @param path [string]   - relative path to baseUrl
 * @return, Response Data
 */
export function useApi<T> (method: Method,path: string, payload = {} )
                          : [T | undefined, SetState<T | undefined>] {

  const [data, setData] = useState<T>();

  useEffect(() => {
    api(method, path, setData, payload);
  }, [path]);

  return [data, setData];
}

/*
 * This useApi2 function was copied from useApi above and changed as follows:
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
 * Useful for calls on events or with conditions
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
  }).then((raw: AxiosResponse<T>) =>{
    console.log("res: ", raw.data)
    return raw.data})
    .then((response: any) => {
    return callback(response.data);
  });
}

/**
 *  Simplified API
 * 
 * @param   method  [Method]  - http method
 * @param   path    [string]  - relative path to baseUrl
 * @param   data    [object]  - body data
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
