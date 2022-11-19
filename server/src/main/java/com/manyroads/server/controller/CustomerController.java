package com.manyroads.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.manyroads.server.logic.helper;
import com.manyroads.server.model.*;
import com.manyroads.server.repository.CustomerRepository;
import com.manyroads.server.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for receiving and sending requests for Customer data
 */
@CrossOrigin
@RestController
@RequestMapping("/customer")
public class CustomerController {

    // *** Constants ***

    // *** Declaration and initialisation of attributes ***
    @Autowired
    private CustomerRepository repository;

    @Autowired
    private CustomerService customerService;

    // *** Constructor ***
    public CustomerController(CustomerRepository repository, CustomerService customerService) {
        this.repository = repository;
        this.customerService = customerService;
    }

    // *** Routing ***
    /**
     * Returns customers data based on pagination and search requests
     *
     * @return json [String]    : customer data in json format
     */
    @PostMapping("/all")
    @ResponseBody
    public String getAll(@RequestBody Map<String, Object> params) {

        System.out.println("Route getDataForDatatable");
        System.out.println("params: " + params.toString());

        // *** Constant and variables ***
        int pageLength = params.containsKey("pageLength") ? Integer.parseInt(params.get("pageLength").toString()) : 30;
        int startPage = params.containsKey("startPage") ? Integer.parseInt(params.get("startPage").toString()) : 30;
        int currentPage = startPage ;

        String sortName = "id";
        // Note : sort per columns not yet implemented!!
        /*
        String dataTableOrderColumnIdx = params.get("order[0][column]").toString();
        String dataTableOrderColumnName = "columns[" + dataTableOrderColumnIdx + "][data]";
        if (params.containsKey(dataTableOrderColumnName))
            sortName = params.get(dataTableOrderColumnName).toString();
        System.out.println("sortName: " + sortName);
        String sortDir = params.containsKey("order[0][dir]") ? params.get("order[0][dir]").toString() : "asc";
        System.out.println("sortDir: " + sortDir);
        */

        // Note : Sort direction ASC / DESC not yet implemented
        Sort.Order sortOrder = new Sort.Order((Sort.Direction.ASC), sortName);
       // Sort.Order sortOrder = new Sort.Order((sortDir.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC), sortName);

        Sort sort = Sort.by(sortOrder);

        Pageable pageRequest = PageRequest.of(currentPage,
                pageLength,
                sort);

        String queryString = (String) (params.get("searchTerm"));

        /**
         *  Function for pagination and searching
         *
         * @param queryString [String]          : search term to be looked up
         * @param pageRequest [Pageable]        : currentPage, pageLength and sort
         * @return customers  [Page<Customer>]  : customers as per query and pagelength
         */
        Page<Customer> customers = customerService.getCustomersForDatatable(queryString, pageRequest);
        System.out.println("customers: " + customers.toString());

        long totalRecords = customers.getTotalElements();

        List<Map<String, Object>> cells = new ArrayList<>();
        customers.forEach(customer -> {

            Map<String, Object> cellData = new HashMap<>();
            cellData.put("id", customer.getId());
            cellData.put("firstName", customer.getFirstName());
            cellData.put("lastName", customer.getLastName());
            cellData.put("emailAddress", customer.getEmailAddress());
            cellData.put("address", customer.getAddress());
            cellData.put("city", customer.getCity());
            cellData.put("country", customer.getCountry());
            cellData.put("phoneNumber", customer.getPhoneNumber());

            cells.add(cellData);
        });
        // Put complete map together
        Map<String, Object> jsonMap = new HashMap<>();

        jsonMap.put("recordsTotal", customers.getTotalPages());
        jsonMap.put("recordsFiltered", totalRecords);
        jsonMap.put("data", cells);

        // Convert to json
        String json = null;
        try {
            json = new ObjectMapper().writeValueAsString(jsonMap);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return json;
    }

    
}
