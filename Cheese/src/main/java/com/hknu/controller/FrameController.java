package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.FrameDto;
import com.hknu.service.FrameServiceImpl;

@Controller
public class FrameController {
	@Autowired
	private FrameServiceImpl FrameServiceImpl;
	
	public String getFrameById(int id, Model model) {
		return null;
	}
	
	public String getAllFrames(Model model) {
		return null;
	}
	
	public String newFrame(Model model) {
		return null;
	}
	
	public String insertFrame(FrameDto fd) {
		return null;
	}
	
	public String updateFrame(FrameDto fd) {
		return null;
	}
	
	public String deleteFrame(int id) {
		return null;
	}
}
