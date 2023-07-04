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
	
	public StickerDto getById(int id) {
		Sticker sticker = this.stickerDaoImpl.getById(id);
		StickerDto stickerDto = new StickerDto(
				sticker.getSticker_id(),
				sticker.getSticker_image());
		// test
		System.out.println(stickerDto.toString());
		return stickerDto;
	}
	
	public List<StickerDto> getAll() {
		List<Sticker> stickerList = this.stickerDaoImpl.getAll();
		List<StickerDto> stickerDtoList = new ArrayList<>();
		
		for (int i = 0; i < stickerList.size(); i++) {
			Sticker sticker = stickerList.get(i);
			StickerDto stickerDto = new StickerDto(
					sticker.getSticker_id(),
					sticker.getSticker_image());
			stickerDtoList.add(stickerDto);
		}
		//test
		System.out.println(stickerDtoList.toString());
		return stickerDtoList;
	}
	
	public void insert(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getStickerImage());
		this.stickerDaoImpl.insert(sticker);
	}
	
	public void update(StickerDto sd) {
		Sticker sticker = new Sticker(
				sd.getStickerId(),
				sd.getStickerImage());
		this.stickerDaoImpl.update(sticker);
	}
	
	public void delete(int id) {
		this.stickerDaoImpl.delete(id);
	}
}