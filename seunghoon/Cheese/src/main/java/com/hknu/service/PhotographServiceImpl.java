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
	
	public PhotographDto getById(int id) {
		Photograph photograph = this.photographDaoImpl.getById(id);
		PhotographDto photographDto = new PhotographDto(
				photograph.getPhotograph_id(),
				photograph.getCustomer_id(),
				null,
				photograph.getCreated_at(),
				photograph.getShooted_at(), 
				photograph.getPhoto_image());
		// test
		System.out.println(photographDto.toString());
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
					null,
					photograph.getCreated_at(),
					photograph.getShooted_at(), 
					photograph.getPhoto_image());
			photographDtoList.add(photographDto);
		}
		//test
		System.out.println(photographDtoList.toString());
		return photographDtoList;
	}
	
	public void insert(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getCreatedAt(),
				pd.getPhotoImage());
		if(!pd.getShootedAt().equals(null)) {
			photograph.setShooted_at(pd.getShootedAt());
		}
		this.photographDaoImpl.insert(photograph);
	}
	
	public void update(PhotographDto pd) {
		Photograph photograph = new Photograph(
				pd.getPhotographId(),
				pd.getCustomerId(), 
				pd.getCreatedAt(),
				pd.getPhotoImage());
		if(!pd.getShootedAt().equals(null)) {
			photograph.setShooted_at(pd.getShootedAt());
		}
		this.photographDaoImpl.update(photograph);
	}
	
	public void delete(int id) {
		this.photographDaoImpl.delete(id);
	}
}