package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.StickerDto;
import com.hknu.service.StickerServiceImpl;

@Controller
public class StickerController {
	@Autowired
	private StickerServiceImpl StickerServiceImpl;
	
	public String getStickerById(int id, Model model) {
		return null;
	}
	
	public String getAllStickers(Model model) {
		return null;
	}
	
	public String newSticker(Model model) {
		return null;
	}
	
	public String insertSticker(StickerDto sd) {
		return null;
	}
	
	public String updateSticker(StickerDto sd) {
		return null;
	}
	
	public String deleteSticker(int id) {
		return null;
	}
}
