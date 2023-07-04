package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.hknu.dto.CustomerDto;
import com.hknu.service.CustomerServiceImpl;

@Controller
public class HomeController {
	@Autowired
	private CustomerServiceImpl customerServiceImpl;
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() {
		this.customerServiceImpl.getById(1);
		
//		this.customerServiceImpl.delete(1);		
		
//		this.customerServiceImpl.getAll();
		
//		CustomerDto customerDto = new CustomerDto(
//				1,
//				"mno@hknu.ac.kr", 
//				"5",
//				(float) 5.5, 
//				"hwang", 
//				null, 
//				null, 
//				null, 
//				null);
//		this.customerServiceImpl.update(customerDto);
		
//		CustomerDto customerDto = new CustomerDto(
//				5,
//				"mno@hknu.ac.kr", 
//				"5",
//				(float) 5.5, 
//				"hwang", 
//				null, 
//				null, 
//				null, 
//				null);
//		this.customerServiceImpl.insert(customerDto);
		
		return "index";
	}
}