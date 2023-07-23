package com.hknu.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.hknu.dao.BranchDaoImpl;
import com.hknu.dto.BranchDto;
import com.hknu.entity.Branch;

@org.springframework.stereotype.Service
public class BranchServiceImpl implements Service<BranchDto>{
	@Autowired
	private BranchDaoImpl branchDaoImpl;
	@Autowired
	private FrameServiceImpl frameServiceImpl;
	@Autowired
	private StickerServiceImpl stickerServiceImpl;
	@Autowired
	private FilterServiceImpl filterServiceImpl;
	@Value("${cheese.shooting-cost}")
	private Integer defaultShootingCost;
	@Value("${cheese.printing-cost}")
	private Integer defaultPrintingCost;
	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> cameraQueue = new ConcurrentHashMap<>();
	private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> printerQueue = new ConcurrentHashMap<>();
	
	public BranchDto getById(Integer id) {
		Branch branch = this.branchDaoImpl.getById(id);
		BranchDto branchDto = new BranchDto(
				branch.getBranch_id(),
				branch.getName(),
				branch.getLatitude(),
				branch.getLongitude(),
				branch.getShooting_cost() != 0 ? branch.getShooting_cost() : defaultShootingCost,
				branch.getPrinting_cost() != 0 ? branch.getPrinting_cost() : defaultPrintingCost, 
				branch.getPaper_amount(), 
				this.frameServiceImpl.getListByBranchId(id), 
				this.stickerServiceImpl.getListByBranchId(id), 
				this.filterServiceImpl.getListByBranchId(id));

		return branchDto;
	}
	
	public List<BranchDto> getAll() {
		List<Branch> branchList = this.branchDaoImpl.getAll();
		List<BranchDto> branchDtoList = new ArrayList<>();
		
		for (int i = 0; i < branchList.size(); i++) {
			Branch branch = branchList.get(i);
			BranchDto branchDto = new BranchDto(
					branch.getBranch_id(),
					branch.getName(),
					branch.getLatitude(),
					branch.getLongitude(),
					branch.getShooting_cost() != 0 ? branch.getShooting_cost() : defaultShootingCost,
					branch.getPrinting_cost() != 0 ? branch.getPrinting_cost() : defaultPrintingCost, 
					branch.getPaper_amount(), 
					this.frameServiceImpl.getListByBranchId(branch.getBranch_id()), 
					this.stickerServiceImpl.getListByBranchId(branch.getBranch_id()), 
					this.filterServiceImpl.getListByBranchId(branch.getBranch_id()));
			branchDtoList.add(branchDto);
		}

		return branchDtoList;
	}
	
	public void insert(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getName(),
				bd.getLatitude(),
				bd.getLongitude(),
				Objects.nonNull(bd.getShootingCost()) ? bd.getShootingCost() : defaultShootingCost,
				Objects.nonNull(bd.getPrintingCost()) ? bd.getPrintingCost() : defaultPrintingCost, 
				bd.getPaperAmount());
		this.branchDaoImpl.insert(branch);
	}
	
	public void update(BranchDto bd) {
		Branch branch = new Branch(
				bd.getBranchId(),
				bd.getName(),
				bd.getLatitude(),
				bd.getLongitude(),
				bd.getShootingCost(),
				bd.getPrintingCost(), 
				bd.getPaperAmount());
		this.branchDaoImpl.update(branch);
	}
	
	public void delete(Integer id) {
		this.branchDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.branchDaoImpl.getMaxPkValue();
	}
	
	private ConcurrentLinkedQueue<String> getOrCreateQueue(Integer branchId, Boolean cameraOrPrint) {
		if (!cameraOrPrint) {
			return cameraQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
		}
		else {
			return printerQueue.computeIfAbsent(branchId, k -> new ConcurrentLinkedQueue<>());
		}
	}
	
	public ConcurrentLinkedQueue<String> getQueue(Integer branchId, Boolean cameraOrPrint) {
		if (!cameraOrPrint) {
			return cameraQueue.get(branchId);
		}
		else {
			return printerQueue.get(branchId);
		}
	}
	
	public void enQueue(Integer branchId, String device, Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = getOrCreateQueue(branchId, cameraOrPrint);
		queue.add(device);
	}
	
	public String deQueue(Integer branchId, Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = null;
		if (!cameraOrPrint) {
			queue = cameraQueue.get(branchId);
		}
		else {
			queue = printerQueue.get(branchId);
		}
		
		if (queue != null) {
			return queue.poll();
		}
		return null;
	}
	
	public Boolean removeFromQueue(Integer branchId, String device, Boolean cameraOrPrint) {
		ConcurrentLinkedQueue<String> queue = null;
		if (!cameraOrPrint) {
			queue = cameraQueue.get(branchId);
		}
		else {
			queue = printerQueue.get(branchId);
		}
		
		if (queue != null) {
			return queue.remove(device);
		}
		return false;
	}
}
