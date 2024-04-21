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

import com.hknu.dto.ShareDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.ShareServiceImpl;

@RestController
public class ShareController {
	@Autowired
	private ShareServiceImpl shareServiceImpl;

	// 사진 공유하기
	@PostMapping(value = "/share/{customerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<NullType>> insertShare(
			@PathVariable Integer customerId, 
			@RequestParam List<MultipartFile> photo,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.shareServiceImpl.insertShare(customerId, photo, accessToken, refreshToken);
	}
	
	// 사진 공유 글 삭제하기
	@DeleteMapping(value = "/share/{customerId}/{shareId}")
	public ResponseEntity<ResponseDto<NullType>> deleteShare(
			@PathVariable Integer customerId,
			@PathVariable Integer shareId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.shareServiceImpl.deleteShare(customerId, shareId, accessToken, refreshToken);
	}
	
	// 내가 공유한 사진 공유 글 조회하기
	@GetMapping(value = "/share/{customerId}")
	public ResponseEntity<ResponseDto<List<ShareDto>>> getShareByCustomerId(
			@PathVariable Integer customerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken, 
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.shareServiceImpl.getShareByCustomerId(customerId, accessToken, refreshToken);
	}
	
	// 사진 공유 글 조회하기, 지점별 사진 공유 글 조회하기
	@GetMapping(value = "/share/page/{index}")
	public ResponseEntity<ResponseDto<List<ShareDto>>> getListShares(
			@PathVariable Integer index, 
			@RequestParam(required = false) Integer branchId) {
		return this.shareServiceImpl.getListShares(index, branchId);
	}
}
