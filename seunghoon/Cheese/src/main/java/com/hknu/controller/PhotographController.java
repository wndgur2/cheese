package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.PhotographDto;
import com.hknu.service.PhotographServiceImpl;

@Controller
public class PhotographController {
	@Autowired
	private PhotographServiceImpl PhotographServiceImpl;
	
	public String getPhotographById(int id, Model model) {
		return null;
	}
	
	public String getAllPhotographs(Model model) {
		return null;
	}
	
	public String newPhotograph(Model model) {
		return null;
	}

	public String insertPhotograph(PhotographDto pd) {
		return null;
	}
	
	public String updatePhotograph(PhotographDto pd) {
		return null;
	}
	
	public String deletePhotograph(int id) {
		return null;
	}
}
