package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.StickerDaoImpl;
import com.hknu.dto.StickerDto;
import com.hknu.entity.Sticker;

@org.springframework.stereotype.Service
public class StickerServiceImpl implements Service<StickerDto>{
	@Autowired
	private StickerDaoImpl stickerDaoImpl;
	
	public StickerDto getById(Integer id) {
		Sticker sticker = this.stickerDaoImpl.getById(id);
		StickerDto stickerDto = new StickerDto(
				sticker.getSticker_id(),
				sticker.getBranch_id(),
				sticker.getSticker_image());

		return stickerDto;
	}
	
	public List<StickerDto> getAll() {
		List<Sticker> stickerList = this.stickerDaoImpl.getAll();
		List<StickerDto> stickerDtoList = new ArrayList<>();
		
		for (int i = 0; i < stickerList.size(); i++) {
			Sticker sticker = stickerList.get(i);
			StickerDto stickerDto = new StickerDto(
					sticker.getSticker_id(),
					sticker.getBranch_id(),
					sticker.getSticker_image());
			stickerDtoList.add(stickerDto);
		}

		return stickerDtoList;
	}
	
	public List<StickerDto> getListByBranchId(Integer id) {
		List<Sticker> stickerList = this.stickerDaoImpl.getListByBranchId(id);
		List<StickerDto> stickerDtoList = new ArrayList<>();
		
		if (stickerList == null) {
			return null;
		}
		
		for (int i = 0; i < stickerList.size(); i++) {
			Sticker sticker = stickerList.get(i);
			StickerDto stickerDto = new StickerDto(
					sticker.getSticker_id(),
					sticker.getBranch_id(),
					sticker.getSticker_image());
			stickerDtoList.add(stickerDto);
		}

		return stickerDtoList;
	}
	
	public Integer getMaxPkValue() {
		return this.stickerDaoImpl.getMaxPkValue();
	}
	
	public void insert(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getBranchId(),
				sd.getStickerImage());
		this.stickerDaoImpl.insert(sticker);
	}
	
	public void update(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getBranchId(),
				sd.getStickerImage());
		this.stickerDaoImpl.update(sticker);
	}
	
	public void delete(Integer id) {
		this.stickerDaoImpl.delete(id);
	}
}