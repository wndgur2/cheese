package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.ShareDto;
import com.hknu.service.ShareServiceImpl;

@Controller
public class ShareController {
	@Autowired
	private ShareServiceImpl shareServiceImpl;
	
	public String getShareById(int id, Model model) {
		return null;
	}
	
	public String getAllShares(Model model) {
		return null;
	}
	
	public String newShare(Model model) {
		return null;
	}
	
	public String insertShare(ShareDto sd) {
		return null;
	}
	
	public String updateShare(ShareDto sd) {
		return null;
	}
	
	public String deleteShare(int id) {
		return null;
	}
}
