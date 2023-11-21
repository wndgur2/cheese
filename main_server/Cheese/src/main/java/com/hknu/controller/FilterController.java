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

import com.hknu.dto.FilterDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.FilterServiceImpl;

@RestController
public class FilterController {
	@Autowired
	private FilterServiceImpl filterServiceImpl;
	
	// 필터 추가하기
	@PostMapping(value = "/item/filter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<NullType>> insertFilter(
			@RequestParam(required = false) Integer branchId,
			@RequestParam Integer brightness,
			@RequestParam Integer exposure,
			@RequestParam Integer contrast,
			@RequestParam Integer chroma,
			@RequestParam Integer temperature,
			@RequestParam Integer livliness,
			@RequestParam Integer tint,
			@RequestParam Integer tone,
			@RequestParam Integer highlight,
			@RequestParam Integer shadow,
			@RequestParam Integer sharpness,
			@RequestParam Integer grain,
			@RequestParam Integer vineting,
			@RequestParam Integer afterImage,
			@RequestParam Integer dehaze,
			@RequestParam Integer posterize,
			@RequestParam Integer blur,
			@RequestParam Integer mosaic,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.filterServiceImpl.insertFilter(branchId, brightness, exposure, contrast, chroma, temperature, livliness, tint, tone, highlight, shadow, sharpness, grain, vineting, afterImage, dehaze, posterize, blur, mosaic, accessToken, refreshToken);
	}
	
	// 필터 삭제하기
	@DeleteMapping(value = "/item/filter/{filterId}")
	public ResponseEntity<ResponseDto<NullType>> deleteFilter(
			@PathVariable Integer filterId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.filterServiceImpl.deleteFilter(filterId, accessToken, refreshToken);
	}
	
	// 필터 가져오기
	@GetMapping(value = "/item/filter")
	public ResponseEntity<ResponseDto<List<FilterDto>>> getListFilters(
			@RequestParam(required = false) Integer branchId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.filterServiceImpl.getListFilters(branchId, accessToken, refreshToken);
	}
}
