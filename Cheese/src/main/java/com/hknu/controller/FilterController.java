package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.FilterDto;
import com.hknu.service.FilterServiceImpl;

@Controller
public class FilterController {
	@Autowired
	private FilterServiceImpl FilterServiceImpl;
	
	public String getFilterById(int id, Model model) {
		return null;
	}
	
	public String getAllFilters(Model model) {
		return null;
	}
	
	public String newFilter(Model model) {
		return null;
	}
	
	public String insertFilter(FilterDto fd) {
		return null;
	}
	
	public String updateFilter(FilterDto fd) {
		return null;
	}
	
	public String deleteFilter(int id) {
		return null;
	}
}
