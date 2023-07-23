package com.hknu.controller;

import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.TimelapseDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.TimelapseServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class TimelapseController {
	@Autowired
	private TimelapseServiceImpl timelapseServiceImpl;
	@Autowired
	private TokenService tokenService;
	
	// 타임랩스 파일 여부 확인
//	private boolean isVideoFile(String contentType) {
//	    return contentType != null && (contentType.startsWith("video/mp4") ||			// MP4
//	                                   contentType.startsWith("video/x-msvideo") ||		// AVI
//	                                   contentType.startsWith("video/quicktime"));		// MOV
//	                                   contentType.startsWith("video/x-matroska") ||	// MKV
//	                                   contentType.startsWith("video/x-flv") ||			// FLV
//	                                   contentType.startsWith("video/webm") ||			// WebM
//	}
	
	// 클라우드 타임랩스 가져오기
	@GetMapping(value = "/cloud/{customerId}/timelapse")
	public ResponseEntity<ResponseDto<List<TimelapseDto>>> getCustomerCloudData(@PathVariable Integer customerId,
									   											@RequestHeader(required = false, value = "Authorization") String accessToken, 
									   											@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<TimelapseDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<TimelapseDto> timelapseDtoList = this.timelapseServiceImpl.getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 타입랩스를 가져왔습니다.", timelapseDtoList),
				HttpStatus.OK);
	}
	
	// 클라우드 타임랩스 삭제하기
	@DeleteMapping(value = "/cloud/{customerId}/timelapse/{timelapseId}")
	public ResponseEntity<ResponseDto<Null>> deleteCustomerCloudTimelapse(@PathVariable Integer customerId, 
																		  @PathVariable Integer timelapseId,
																		  @RequestHeader(required = false, value = "Authorization") String accessToken,
																		  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		TimelapseDto timelapseDto = this.timelapseServiceImpl.getById(timelapseId);
		
		if (timelapseDto.getCustomerId().equals(customerId)) {
			this.timelapseServiceImpl.delete(timelapseId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 클라우드에 타입랩스를 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("타입랩스와 회원 정보가 일치하지 않습니다.");
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
