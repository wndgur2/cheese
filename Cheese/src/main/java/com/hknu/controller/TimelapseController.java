package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.TimelapseDto;
import com.hknu.service.TimelapseServiceImpl;

@Controller
public class TimelapseController {
	@Autowired
	private TimelapseServiceImpl TimelapseServiceImpl;
	
	public String getTimelapseById(int id, Model model) {
		return null;
	}
	
	public String getAllTimelapses(Model model) {
		return null;
	}
	
	public String newTimelapse(Model model) {
		return null;
	}
	
	public String insertTimelapse(TimelapseDto td) {
		return null;
	}
	
	public String updateTimelapse(TimelapseDto td) {
		return null;
	}
	
	public String deleteTimelapse(int id) {
		return null;
	}
}
