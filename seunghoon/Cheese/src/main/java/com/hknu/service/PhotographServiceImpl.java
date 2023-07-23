package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.PhotographDaoImpl;
import com.hknu.dto.PhotographDto;
import com.hknu.entity.Photograph;

@org.springframework.stereotype.Service
public class PhotographServiceImpl implements Service<PhotographDto>{
	@Autowired
	private PhotographDaoImpl photographDaoImpl;
	
	public PhotographDto getById(Integer id) {
		Photograph photograph = this.photographDaoImpl.getById(id);
		PhotographDto photographDto = new PhotographDto(
				photograph.getPhotograph_id(),
				photograph.getCustomer_id(),
				photograph.getBranch_id(),
				photograph.getCreated_at(),
				photograph.getPhoto_image());

		return photographDto;
	}
	
	public List<PhotographDto> getAll() {
		List<Photograph> photographList = this.photographDaoImpl.getAll();
		List<PhotographDto> photographDtoList = new ArrayList<>();
		
		for (int i = 0; i < photographList.size(); i++) {
			Photograph photograph = photographList.get(i);
			PhotographDto photographDto = new PhotographDto(
					photograph.getPhotograph_id(),
					photograph.getCustomer_id(),
					photograph.getBranch_id(),
					photograph.getCreated_at(),
					photograph.getPhoto_image());
			photographDtoList.add(photographDto);
		}

		return photographDtoList;
	}
	
	public void insert(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getBranchId(),
				pd.getCreatedAt(),
				pd.getPhotoImage());
		this.photographDaoImpl.insert(photograph);
	}
	
	public void update(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getBranchId(),
				pd.getCreatedAt(),
				pd.getPhotoImage());
		this.photographDaoImpl.update(photograph);
	}
	
	public void delete(Integer id) {
		this.photographDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.photographDaoImpl.getMaxPkValue();
	}
	
	public PhotographDto getByPhotoImage(byte[] image) {
		Photograph photograph = this.photographDaoImpl.getByPhotoImage(image);
		PhotographDto photographDto = new PhotographDto(
				photograph.getPhotograph_id(), 
				photograph.getCustomer_id(), 
				photograph.getBranch_id(), 
				photograph.getCreated_at(), 
				photograph.getPhoto_image());
		return photographDto;
	}
	
	public List<PhotographDto> getListByCustomerId(Integer id) {
		List<Photograph> photographList = this.photographDaoImpl.getListByCustomerId(id);
		List<PhotographDto> photographDtoList = new ArrayList<>();
		
		if (photographList == null) {
			return null;
		}
		
		for (int i = 0; i < photographList.size(); i++) {
			Photograph photograph = photographList.get(i);
			PhotographDto photographDto = new PhotographDto(
					photograph.getPhotograph_id(),
					photograph.getCustomer_id(),
					photograph.getBranch_id(),
					photograph.getCreated_at(),
					photograph.getPhoto_image());
			photographDtoList.add(photographDto);
		}
		return photographDtoList;
	}
}