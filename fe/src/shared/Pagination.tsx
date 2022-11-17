import { ReactNode } from "react"

interface Props{
    currentPage           : number,
    totalPages            : any,
    rowsPerPage           : number
    onSetPage(page:number): void,
    children?             : ReactNode;
}

/*
+ Pagination component which outputs buttons previous, next and current page
*
* @params see props
*/
export const Pagination = (props:Props) =>{

    // ************* Constants and variables ************* 
    let pageNrsDisplayed          = [];
    const maxPaginationDisplayed  = 3;
    let previous                  = 1;
    let pageNrDisplayed           = 
    Math.floor((props.currentPage +1) / 
    maxPaginationDisplayed) * 
    maxPaginationDisplayed;
    let next                      = props.currentPage;
    let activePage                = "page-item";

    // Calculate number of pages to display
    // const totalPages = Math.ceil(props.rows / props.rowsPerPage);
    const totalPages = props.totalPages;

    // Define previous button
    if (props.currentPage > 1) previous = props.currentPage -1;
    // Define next button   
    if (props.currentPage < totalPages) next = props.currentPage +1 ;
    console.log("next:", next)

    for (let i = 1; i <= totalPages ; i++) {
        
      // Highlight currentPage    
      activePage = ((props.currentPage) === i)? "page-item active": "page-item";

      // Configure page number component with button incorporated
      pageNrsDisplayed.push( 
      <li 
      key         ={i} 
      className   ={activePage}>
        <button 
        onClick   ={()=>props.onSetPage(i)} 
        className = "page-link" >{i}
        </button>
      </li>)
    }

  return(
  
  <div className="container">
    <nav aria-label="Page navigation example">
      <ul className="pagination">

        {/* First Page */}
        <li 
        className="page-item">
          <button 
            onClick   ={()=>props.onSetPage(1)} 
            className ="page-link" >
              1
          </button>
        </li>
        
        {/* Previous button */}
        <li 
        className="page-item">
          <button 
          onClick   ={()=>props.onSetPage(previous)} 
          className ="page-link" >
            Previous
          </button>
        </li> 
        
        {/* // Page number displayed */}
        <li className="ppage-item disabled">
          <span className ="page-link">{props.currentPage}</span>
        </li>

        {/* //Next button */}
        <li 
        className="page-item">
          <button 
          onClick   ={()=>props.onSetPage(next)} 
          className ="page-link" >
            Next
          </button>
        </li>

        {/* Last Page */}
        <li 
        className="page-item">
          <button 
            onClick   ={()=>props.onSetPage(props.totalPages)} 
            className ="page-link" >
              {props.totalPages}
          </button>
        </li>
      </ul>
    </nav>
  </div>    
  )
}