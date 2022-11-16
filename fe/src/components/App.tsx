import React, { useState } from 'react';
import { useApi } from '../shared/Api';
import { Spinner } from '../shared/Spinner';
import { Customer } from '../types/Customer';


function App() {

  // *** Constant and variables ***
  const [page, setPage]           = useState(1);
  const rowsPerPage               = [10,15,25];
  const [rows,setRows]            = useState<String>("10");
  const [customers, setCustomer]  = useApi<Customer[]>("all");

  if(!customers) return(<Spinner item="Customers... " />)

  console.log("all ", customers);
  
  // *************** Event handling ***************
  /**
   * Set page for Pagination
   */
   const onSetPage = (page   : number) => setPage(page);
  return (
    <>
    	<div className="container">
		    <h3>Select Number Of Rows</h3>
				<div className="form-group"> 	
			 		<select 
          className  ="form-control" 
          name="state"
          onChange = {(e)=>{setRows(e.target.value)}}
          >
            {rowsPerPage.map(rows =>
						 <option key={rows} value="10">{rows}</option>
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
</>
);
}

export default App;
