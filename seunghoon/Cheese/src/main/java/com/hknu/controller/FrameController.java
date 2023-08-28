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

import com.hknu.dto.FrameDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.FrameServiceImpl;

@RestController
public class FrameController {
	@Autowired
	private FrameServiceImpl frameServiceImpl;
	
	// 프레임 추가하기
	@PostMapping(value = "/item/frame", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<NullType>> insertFrame(
			@RequestParam(required = false) Integer branchId, 
			@RequestParam MultipartFile image,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.frameServiceImpl.insertFrame(branchId, image, accessToken, refreshToken);
	}
	
	// 프레임 삭제하기
	@DeleteMapping(value = "/item/frame/{frameId}")
	public ResponseEntity<ResponseDto<NullType>> deleteFrame(
			@PathVariable Integer frameId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.frameServiceImpl.deleteFrame(frameId, accessToken, refreshToken);
	}
	
	// 프레임 가져오기
	@GetMapping(value = "/item/frame")
	public ResponseEntity<ResponseDto<List<FrameDto>>> getListFrames(
			@RequestParam(required = false) Integer branchId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.frameServiceImpl.getListFrames(branchId, accessToken, refreshToken);
	}
}
