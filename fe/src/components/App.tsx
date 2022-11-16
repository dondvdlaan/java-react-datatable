import React, { useState } from 'react';
import { apiSimple, useApi } from '../shared/Api';
import { Pagination } from '../shared/Pagination';
import { Spinner } from '../shared/Spinner';
import { Customer } from '../types/Customer';


function App() {

  // *** Constant and variables ***
  const arrRowsPerPage                = [10,15,25];
  const initPayload                   = {draw:1, length: arrRowsPerPage[0], start:0};

  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<any>(arrRowsPerPage[0]);
  const [customers, setCustomer]      = useApi<Customer[] >("POST","all",initPayload);
  

  if(!customers) return(<Spinner item="Customers... " />)

  console.log("all ", customers);
  console.log("rows ", rowsPerPage);

  // *** Functions ***
  const payload = ()=>({
    length : rowsPerPage,
    start : (page -1) * rowsPerPage
  })

  
  // *** Event handling ***
/**
 * Change rows per page
 */
  const onRefresh = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    setRowsPerPage(e.target.value);
    let data ={length : e.target.value, start: 0 }
    apiSimple("POST","all", data)
    .then(res=>{
      console.log("res.data: ", res.data)
      setCustomer(res.data.data)
      setPage(1)})
  }
  /**
   * Set page for Pagination
   */
   const onSetPage = (page: number) =>{
    console.log("page: ", page)
    setPage(page);
    let data ={...payload(), start : (page -1) * rowsPerPage}
    apiSimple("POST","all", data)
    .then(res=>setCustomer(res.data.data))
   } 
  
  return (
    <>
    	<div className="container">
		    <h3>Select Number Of Rows</h3>
				<div className="form-group"> 	
			 		<select 
          className  ="form-control" 
          name="state"
          value={rowsPerPage}
          onChange = {(e)=>{onRefresh(e)}}
          >
            {arrRowsPerPage.map(rows =>
						 <option key={rows} >{rows}</option>
             )}
					</select>
		  	</div>
	  	</div>

  <div className="container">
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First name</th>
          <th scope="col">Last name</th>
          <th scope="col">Email</th>
          <th scope="col">Address</th>
          <th scope="col">City</th>
          <th scope="col">Country</th>
          <th scope="col">Tel number</th>
        </tr>
      </thead>
      <tbody>
          {customers.map(cust =>
          <tr key={cust.id}>
            <th scope="row">{cust.id}</th>
            <td>{cust.firstName}</td>
            <td>{cust.lastName}</td>
            <td>{cust.emailAddress}</td>
            <td>{cust.address}</td>
            <td>{cust.city}</td>
            <td>{cust.country}</td>
            <td>{cust.phoneNumber}</td>
          </tr> 
          )}
      </tbody>
    </table>
  </div> 
  <Pagination 
  currentPage={page} 
  rows={1000} 
  rowsPerPage={rowsPerPage} 
  onSetPage={onSetPage}
  /> 
</>
);
}

export default App;
