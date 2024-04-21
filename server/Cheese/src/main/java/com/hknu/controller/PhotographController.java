package com.hknu.controller;

import java.util.List;

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

import com.hknu.dto.CustomerDto;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.PhotographServiceImpl;

@RestController
public class PhotographController {
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	
	// 클라우드 사진 가져오기
	@GetMapping(value = "/cloud/{customerId}/photo")
	public ResponseEntity<ResponseDto<List<PhotographDto>>> getCustomerCloudData(
			@PathVariable Integer customerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.photographServiceImpl.getCustomerCloudPhotograph(customerId, accessToken, refreshToken);
	}

	// 클라우드 사진 추가하기
	@PostMapping(value = "/cloud/{customerId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<CustomerDto>> insertCustomerCloudData(
			@PathVariable Integer customerId, 
			@RequestParam MultipartFile data, 
			@RequestParam(required = false) Integer branchId,
			@RequestHeader(required = false, value = "Authorization") String accessToken, 
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.photographServiceImpl.insertCustomerCloudPhotograph(customerId, data, branchId, accessToken, refreshToken);
	}
	
	// 클라우드 사진 삭제하기
	@DeleteMapping(value = "/cloud/{customerId}/photo/{photoId}")
	public ResponseEntity<ResponseDto<CustomerDto>> deleteCustomerCloudPhotograph(
			@PathVariable Integer customerId, 
			@PathVariable Integer photoId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.photographServiceImpl.deleteCustomerCloudPhotograph(customerId, photoId, accessToken, refreshToken);
	}
}
