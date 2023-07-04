package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.CustomerDaoImpl;
import com.hknu.dto.CustomerDto;
import com.hknu.entity.Customer;

@org.springframework.stereotype.Service
public class CustomerServiceImpl implements Service<CustomerDto>{
	@Autowired
	private CustomerDaoImpl customerDaoImpl;
	
	public CustomerDto getById(int id) {
		Customer customer = this.customerDaoImpl.getById(id);
		CustomerDto customerDto = new CustomerDto(
				customer.getCustomer_id(),
				customer.getEmail(), 
				customer.getPassword(),
				customer.getCloud_size(), 
				customer.getNickname(), 
				null, 
				null, 
				null, 
				null);
		// test
		System.out.println(customerDto.toString());
		return customerDto;
	}
	
	public List<CustomerDto> getAll() {
		List<Customer> customerList = this.customerDaoImpl.getAll();
		List<CustomerDto> customerDtoList = new ArrayList<>();
		
		for (int i = 0; i < customerList.size(); i++) {
			Customer customer = customerList.get(i);
			CustomerDto customerDto = new CustomerDto(
					customer.getCustomer_id(),
					customer.getEmail(), 
					customer.getPassword(),
					customer.getCloud_size(), 
					customer.getNickname(), 
					null, 
					null, 
					null, 
					null);
			customerDtoList.add(customerDto);
		}
		//test
		System.out.println(customerDtoList.toString());
		return customerDtoList;
	}
	
	public void insert(CustomerDto cd) {
		Customer customer = new Customer(
				cd.getCustomerId(),
				cd.getEmail(), 
				cd.getPassword(),
				cd.getCloudSize(), 
				cd.getNickname());
		this.customerDaoImpl.insert(customer);
	}
	
	public void update(CustomerDto cd) {
		Customer customer = new Customer(
				cd.getCustomerId(),
				cd.getEmail(), 
				cd.getPassword(),
				cd.getCloudSize(), 
				cd.getNickname());
		this.customerDaoImpl.update(customer);
	}
	
	public void delete(int id) {
		this.customerDaoImpl.delete(id);
	}
}
