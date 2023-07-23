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
	@Autowired
	private PaymentServiceImpl paymentServiceImpl;
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	@Autowired
	private TimelapseServiceImpl timelapseServiceImpl;
	@Autowired
	private ShareServiceImpl shareServiceImpl;
	
	public CustomerDto getById(Integer id) {
		Customer customer = this.customerDaoImpl.getById(id);
		CustomerDto customerDto = new CustomerDto(
				customer.getCustomer_id(),
				customer.getEmail(), 
				customer.getPassword(),
				customer.getCloud_size(), 
				customer.getNickname(), 
				this.paymentServiceImpl.getListByCustomerId(id), 
				this.photographServiceImpl.getListByCustomerId(id), 
				this.timelapseServiceImpl.getListByCustomerId(id), 
				this.shareServiceImpl.getListByCustomerId(id));

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
					this.paymentServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.photographServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.timelapseServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.shareServiceImpl.getListByCustomerId(customer.getCustomer_id()));
			customerDtoList.add(customerDto);
		}

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
	
	public void delete(Integer id) {
		this.customerDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.customerDaoImpl.getMaxPkValue();
	}
	
	public CustomerDto getByEmail(String email) {
		Customer customer = this.customerDaoImpl.getByEmail(email);
		CustomerDto customerDto = new CustomerDto(
				customer.getCustomer_id(),
				customer.getEmail(), 
				customer.getPassword(),
				customer.getCloud_size(), 
				customer.getNickname(), 
				this.paymentServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.photographServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.timelapseServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.shareServiceImpl.getListByCustomerId(customer.getCustomer_id()));

		return customerDto;
	}
}
