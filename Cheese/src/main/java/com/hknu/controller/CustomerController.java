package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.CustomerDto;
import com.hknu.service.CustomerServiceImpl;

@Controller
public class CustomerController {
	@Autowired
	private CustomerServiceImpl customerServiceImpl;
	
	public String getCustomerById(int id, Model model) {
		return null;
	}
	
	public String getAllCustomers(Model model) {
		return null;
	}
	
	public String newCustomer(Model model) {
		return null;
	}
	
	public String insertCustomer(CustomerDto cd) {
		return null;
	}
	
	public String editCustomer(int id, Model model) {
		return null;
	}
	
	public String updateCustomer(CustomerDto cd) {
		return null;
	}
	
	public String deleteCustomer(int id) {
		return null;
	}
}
