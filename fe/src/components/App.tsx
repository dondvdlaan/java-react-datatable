import React, { ChangeEvent, useState } from 'react';
import { apiSimple, useApi } from '../shared/Api';
import { Navbar } from '../shared/Navbar';
import { Pagination } from '../shared/Pagination';
import { Spinner } from '../shared/Spinner';
import { Customer } from '../types/Customer';

/**
 * App to display the Datatable. Pagination and search in all columns come from
 * Server side 
 */
function App() {

  // *** Constant and variables ***
  const arrRowsPerPage                = [10,15,25];
  const initSettings                  = { draw:1, 
                                          pageLength: arrRowsPerPage[0], 
                                          startPage:0};

  const [page, setPage]               = useState(1);
  const [searchTerm, setSearchTerm]   = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<any>(arrRowsPerPage[0]);
  const [ customers, setCustomers,
          totalPages, setTotalPages]:[any,any,any,any]  
                                      = useApi("POST","all",initSettings);
  
 
  if(!customers) return(<Spinner item="Customers... " />)


  // *** Functions ***
  const payload = ()=>({
    searchTerm,
    pageLength : rowsPerPage,
    startPage : (page -1) 
  })

    // *** Components ***
    /**
     * Search window for Datatable
     */
    const SearchDataTable = () =>(
      <div className="panel-block">
        <p className="control has-icons-right">
          <input
            value={searchTerm}
            onChange={onSearch}
            type="text"
            placeholder="Search Datatable"
            className="form-control" 
            autoFocus
          />
          <span className="searchSymbol">
                <i className="searchSymbol" />
          </span>
        </p>
      </div>
    )
  
// *** Event handling ***
/**
 * Change rows per page
 */
  const onChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    setRowsPerPage(e.target.value);

    // Create data payload
    let payload ={
      pageLength : e.target.value, 
      startPage: 0,
      searchTerm: ""
    }
    // Send to server
    apiSimple("POST","all", payload)
    .then(res=>{
      setCustomers(res.data.data);
      setTotalPages(res.data.recordsTotal)
      setPage(1);
      setSearchTerm("");
    })
  }
  /**
   * Set page for Pagination
   */
   const onSetPage = (page: number) =>{
    setPage(page);

    // Create data payload
    let data ={...payload(), startPage : (page -1) }
    
    // Send to server
    apiSimple("POST","all", data)
    .then(res=>setCustomers(res.data.data))
   } 
 /**
   * Send search term to server
   */
  const onSearch = (e: ChangeEvent<HTMLInputElement>) =>{

    setSearchTerm(e.target.value);

    // Create data payload
    let payload ={
      pageLength : arrRowsPerPage[0], 
      startPage: 0,
      searchTerm: e.target.value
    }

    // Send to server
    apiSimple("POST","all", payload)
    .then(res=>{
      setCustomers(res.data.data);
      setTotalPages(res.data.recordsTotal)
      setPage(1);
      setRowsPerPage(arrRowsPerPage[0]);
  })
  }  

  return (
    <>
    <Navbar />

    	<div className="container mt-3 ">
        <div className="row">

          {/* Window to change rows per page */}
          <div className="col">
            <div className="form-group"> 	
              <select 
              className  ="form-control" 
              name="state"
              value={rowsPerPage}
              onChange = {(e)=>{onChangeRowsPerPage(e)}}
              >
                {arrRowsPerPage.map(rows =>
                <option key={rows} >{rows}</option>
                )}
              </select>
            </div>
          </div>

          <div className="col text-end">
            <SearchDataTable />
          </div>
	  	  </div>
	  	</div>

  {/* Datatable */}
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
          {customers.map((customer: Customer) =>
          <tr key={customer.id}>
            <th scope="row">{customer.id}</th>
            <td>{customer.firstName}</td>
            <td>{customer.lastName}</td>
            <td>{customer.emailAddress}</td>
            <td>{customer.address}</td>
            <td>{customer.city}</td>
            <td>{customer.country}</td>
            <td>{customer.phoneNumber}</td>
          </tr> 
          )}
      </tbody>
    </table>
  </div>

  <Pagination 
    currentPage={page} 
    totalPages={totalPages} 
    rowsPerPage={rowsPerPage} 
    onSetPage={onSetPage}
  /> 
</>
);
}

export default App;
