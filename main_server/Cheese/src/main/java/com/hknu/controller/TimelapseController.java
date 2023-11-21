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

import com.hknu.dto.CustomerDto;
import com.hknu.dto.TimelapseDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.TimelapseServiceImpl;

@RestController
public class TimelapseController {
	@Autowired
	private TimelapseServiceImpl timelapseServiceImpl;
	
	// 클라우드 타임랩스 가져오기
	@GetMapping(value = "/cloud/{customerId}/timelapse")
	public ResponseEntity<ResponseDto<List<TimelapseDto>>> getCustomerCloudTimelapse(
			@PathVariable Integer customerId,
			@RequestHeader(required = false, value = "Authorization") String accessToken, 
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.timelapseServiceImpl.getCustomerCloudTimelapse(customerId, accessToken, refreshToken);
	}
	
	// 클라우드 사진 추가하기
	@PostMapping(value = "/cloud/{customerId}/timelapse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<CustomerDto>> insertCustomerCloudTimelapse(
			@PathVariable Integer customerId, 
			@RequestParam MultipartFile data, 
			@RequestParam Integer branchId,
			@RequestHeader(required = false, value = "Authorization") String accessToken, 
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.timelapseServiceImpl.insertCustomerCloudTimelapse(customerId, data, branchId, accessToken, refreshToken);
	}
	
	// 클라우드 타임랩스 삭제하기
	@DeleteMapping(value = "/cloud/{customerId}/timelapse/{timelapseId}")
	public ResponseEntity<ResponseDto<NullType>> deleteCustomerCloudTimelapse(
			@PathVariable Integer customerId, 
			@PathVariable Integer timelapseId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.timelapseServiceImpl.deleteCustomerCloudTimelapse(customerId, timelapseId, accessToken, refreshToken);
	}
}
