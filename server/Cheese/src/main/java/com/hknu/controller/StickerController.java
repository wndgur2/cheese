package com.hknu.controller;

import java.util.List;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hknu.dto.StickerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.StickerServiceImpl;

@RestController
public class StickerController {
	@Autowired
	private StickerServiceImpl stickerServiceImpl;
	
	// 스티커 추가하기
	@PostMapping(value = "/item/sticker", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<NullType>> insertSticker(
			@RequestParam(required = false) Integer branchId, 
			@RequestParam MultipartFile image,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.stickerServiceImpl.insertSticker(branchId, image, accessToken, refreshToken);
	}
	
	// 스티커 삭제하기
	@DeleteMapping(value = "/item/sticker/{stickerId}")
	public ResponseEntity<ResponseDto<NullType>> deleteSticker(
			@PathVariable Integer stickerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.stickerServiceImpl.deleteSticker(stickerId, accessToken, refreshToken);
	}
	
	// 스티커 가져오기
	@GetMapping(value = "/item/sticker")
	public ResponseEntity<ResponseDto<List<StickerDto>>> getListStickers(
			@RequestParam(required = false) Integer branchId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.stickerServiceImpl.getListStickers(branchId, accessToken, refreshToken);
	}
}
