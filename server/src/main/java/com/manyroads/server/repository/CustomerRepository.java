package com.manyroads.server.repository;

import com.manyroads.server.model.Customer;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * This will be AUTO IMPLEMENTED by Spring into a Bean called CustomerRepository
 * CRUD refers to Create, Read, Update, Delete
 */
public interface CustomerRepository extends
                                    CrudRepository<Customer, Integer>,
                                    PagingAndSortingRepository<Customer, Integer>,
                                    JpaSpecificationExecutor<Customer> {

}
