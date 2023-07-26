package com.hknu.controller;

import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.TimelapseDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.TimelapseServiceImpl;

@RestController
public class TimelapseController {
	@Autowired
	private TimelapseServiceImpl timelapseServiceImpl;
	
	// 클라우드 타임랩스 가져오기
	@GetMapping(value = "/cloud/{customerId}/timelapse")
	public ResponseEntity<ResponseDto<List<TimelapseDto>>> getCustomerCloudData(@PathVariable Integer customerId,
									   											@RequestHeader(required = false, value = "Authorization") String accessToken, 
									   											@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.timelapseServiceImpl.getCustomerCloudData(customerId, accessToken, refreshToken);
	}
	
	// 클라우드 타임랩스 삭제하기
	@DeleteMapping(value = "/cloud/{customerId}/timelapse/{timelapseId}")
	public ResponseEntity<ResponseDto<Null>> deleteCustomerCloudTimelapse(@PathVariable Integer customerId, 
																		  @PathVariable Integer timelapseId,
																		  @RequestHeader(required = false, value = "Authorization") String accessToken,
																		  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.timelapseServiceImpl.deleteCustomerCloudTimelapse(customerId, timelapseId, accessToken, refreshToken);
	}
	
//	public String getTimelapseById(Integer id) {
//		return null;
//	}
//	
//	public String getAllTimelapses() {
//		return null;
//	}
//	
//	public String insertTimelapse(TimelapseDto td) {
//		return null;
//	}
//	
//	public String updateTimelapse(TimelapseDto td) {
//		return null;
//	}
//	
//	public String deleteTimelapse(Integer id) {
//		return null;
//	}
}
