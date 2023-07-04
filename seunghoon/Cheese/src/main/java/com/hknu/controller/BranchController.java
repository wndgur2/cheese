package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.BranchDto;
import com.hknu.service.BranchServiceImpl;

@Controller
public class BranchController {
	@Autowired
	private BranchServiceImpl branchServiceImpl;
	
	public String getBranchById(int id, Model model) {
		return null;
	}
	
	public String getAllBranchs(Model model) {
		return null;
	}
	
	public String newBranch(Model model) {
		return null;
	}
	
	public String insertBranch(BranchDto bd) {
		return null;
	}
	
	public String updateBranch(BranchDto bd) {
		return null;
	}
	
	public String deleteBranch(int id) {
		return null;
	}
}
