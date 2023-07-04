package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.BranchDaoImpl;
import com.hknu.dto.BranchDto;
import com.hknu.entity.Branch;

@org.springframework.stereotype.Service
public class BranchServiceImpl implements Service<BranchDto>{
	@Autowired
	private BranchDaoImpl branchDaoImpl;
	
	public BranchDto getById(int id) {
		Branch branch = this.branchDaoImpl.getById(id);
		BranchDto branchDto = new BranchDto(
				branch.getBranch_id(),
				branch.getAddress(), 
				branch.getShooting_cost(),
				branch.getPrinting_cost(), 
				branch.getPaper_amount(), 
				null, 
				null, 
				null);
		// test
		System.out.println(branchDto.toString());
		return branchDto;
	}
	
	public List<BranchDto> getAll() {
		List<Branch> branchList = this.branchDaoImpl.getAll();
		List<BranchDto> branchDtoList = new ArrayList<>();
		
		for (int i = 0; i < branchList.size(); i++) {
			Branch branch = branchList.get(i);
			BranchDto branchDto = new BranchDto(
					branch.getBranch_id(),
					branch.getAddress(), 
					branch.getShooting_cost(),
					branch.getPrinting_cost(), 
					branch.getPaper_amount(), 
					null, 
					null, 
					null);
			branchDtoList.add(branchDto);
		}
		//test
		System.out.println(branchDtoList.toString());
		return branchDtoList;
	}
	
	public void insert(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getAddress(), 
				bd.getShootingCost(),
				bd.getPrintingCost(), 
				bd.getPaperAmount());
		this.branchDaoImpl.insert(branch);
	}
	
	public void update(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getAddress(), 
				bd.getShootingCost(),
				bd.getPrintingCost(), 
				bd.getPaperAmount());
		this.branchDaoImpl.update(branch);
	}
	
	public void delete(int id) {
		this.branchDaoImpl.delete(id);
	}
}
