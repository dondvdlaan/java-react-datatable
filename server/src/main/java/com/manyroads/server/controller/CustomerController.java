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

@CrossOrigin
@RestController
public class CustomerController {

    // *** Constants ***

    // *** Declaration and initialisation of attributes ***
    @Autowired
    private CustomerRepository repository;

    @Autowired
    private CustomerService customerService;

    public CustomerController(CustomerRepository repository, CustomerService customerService) {
        this.repository = repository;
        this.customerService = customerService;
    }

    // *** Routing ***
    /**
     * Returns all customers
     *
     * @return allCustomers Iterable     : all customers
     */
    //@GetMapping("/customer/all")
    @PostMapping("/customer/all")
    @ResponseBody
    public String getAll(@RequestBody Map<String, Object> params) {

        System.out.println("Route getDataForDatatable");
        System.out.println("params: " + params.toString());
/*
        Map<String, Object> params = new HashMap<>();
        params.put("draw", 2);
        params.put("length", 10);
        params.put("start", 10);
*/
        int draw = params.containsKey("draw") ? Integer.parseInt(params.get("draw").toString()) : 1;
        System.out.println("draw: " + draw);
        int length = params.containsKey("length") ? Integer.parseInt(params.get("length").toString()) : 30;
        System.out.println("length: " + length);
        int start = params.containsKey("start") ? Integer.parseInt(params.get("start").toString()) : 30;
        System.out.println("start: " + start);

        int currentPage = start / length;
        System.out.println("currentPage: " + currentPage);

        String sortName = "id";
        /*
        String dataTableOrderColumnIdx = params.get("order[0][column]").toString();
        String dataTableOrderColumnName = "columns[" + dataTableOrderColumnIdx + "][data]";
        if (params.containsKey(dataTableOrderColumnName))
            sortName = params.get(dataTableOrderColumnName).toString();
        System.out.println("sortName: " + sortName);
        String sortDir = params.containsKey("order[0][dir]") ? params.get("order[0][dir]").toString() : "asc";
        System.out.println("sortDir: " + sortDir);

        */

        Sort.Order sortOrder = new Sort.Order((Sort.Direction.ASC), sortName);
       // Sort.Order sortOrder = new Sort.Order((sortDir.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC), sortName);

        System.out.println("sortOrder: " + sortOrder);
        Sort sort = Sort.by(sortOrder);
        System.out.println("sort: " + sort);

        Pageable pageRequest = PageRequest.of(currentPage,
                length,
                sort);
        System.out.println("pageRequest: " + pageRequest);

        String queryString = (String) (params.get("search[value]"));

        Page<Customer> customers = customerService.getCustomersForDatatable(queryString, pageRequest);
        System.out.println("customers: " + customers.toString());

        long totalRecords = customers.getTotalElements();

        List<Map<String, Object>> cells = new ArrayList<>();
        customers.forEach(customer -> {
            System.out.println("customer: " + customer.toString());

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
        System.out.println("cells: " + cells);

        Map<String, Object> jsonMap = new HashMap<>();

        jsonMap.put("draw", draw);
        jsonMap.put("recordsTotal", totalRecords);
        jsonMap.put("recordsFiltered", totalRecords);
        jsonMap.put("data", cells);

        System.out.println("jsonMap: " + jsonMap);

        String json = null;
        try {
            json = new ObjectMapper().writeValueAsString(jsonMap);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        System.out.println("json: " + json);

        return json;
    }

    
}
