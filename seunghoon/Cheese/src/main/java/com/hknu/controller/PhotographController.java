package com.hknu.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.hknu.controller.exception.CustomException;
import com.hknu.controller.exception.DoNotMatchImageTypeException;
import com.hknu.dto.PhotographDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.PhotographServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class PhotographController {
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	@Autowired
	private TokenService tokenService;
	
	// 이미지 파일 여부 확인
	private boolean isImageFile(String contentType) {
	    return contentType != null && (contentType.startsWith("image/jpeg") ||
	                                   contentType.startsWith("image/png") ||
	                                   contentType.startsWith("image/bmp") ||
	                                   contentType.startsWith("image/tiff"));
	}
	
	// 클라우드 사진 가져오기
	@GetMapping(value = "/cloud/{customerId}/photo")
	public ResponseEntity<ResponseDto<List<PhotographDto>>> getCustomerCloudData(@PathVariable Integer customerId, 
																				 @RequestHeader(required = false, value = "Authorization") String accessToken,
																				 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<PhotographDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<PhotographDto> photographDtoList = this.photographServiceImpl.getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 사진을 가져왔습니다.", photographDtoList),
				HttpStatus.OK);
	}

	// 클라우드 사진 추가하기
	@PostMapping(value = "/cloud/{customerId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Null>> insertCustomerCloudData(@PathVariable Integer customerId, 
										  							   @RequestParam MultipartFile data, 
										  							   @RequestParam(required = false) Integer branchId,
										  							   @RequestHeader(required = false, value = "Authorization") String accessToken, 
										  							   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if (!data.isEmpty()) {
			byte[] byteData = null;
			
			try {
				byteData = data.getBytes();
				Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
				
				if (isImageFile(data.getContentType())) {
					PhotographDto photographDto = new PhotographDto(
							this.photographServiceImpl.getMaxPkValue(), 
							customerId, 
							branchId,
							date, 	
							byteData);
					this.photographServiceImpl.insert(photographDto);
				}
				else {
					throw new DoNotMatchImageTypeException();
				}
			}
			catch (IOException e) {
				return new ResponseEntity<>(
						ResponseDto.of("클라우드에 사진을 추가하는 중에 오류가 발생했습니다."),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 클라우드에 사진을 추가했습니다."),
				HttpStatus.OK);
	}
	
	// 클라우드 사진 삭제하기
	@DeleteMapping(value = "/cloud/{customerId}/photo/{photoId}")
	public ResponseEntity<ResponseDto<Null>> deleteCustomerCloudPhotograph(@PathVariable Integer customerId, 
																		   @PathVariable Integer photoId,
																		   @RequestHeader(required = false, value = "Authorization") String accessToken,
																		   @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		PhotographDto photographDto = this.photographServiceImpl.getById(photoId);
		
		if (photographDto.getCustomerId().equals(customerId)) {
			this.photographServiceImpl.delete(photoId);
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 클라우드에 사진을 삭제했습니다."),
					HttpStatus.OK);
		}
		throw new CustomException("사진과 회원 정보가 일치하지 않습니다.");
	}
	
//	public String getPhotographById(Integer id) {
//		return null;
//	}
//	
//	public String getAllPhotographs() {
//		return null;
//	}
//
//	public String insertPhotograph(PhotographDto pd) {
//		return null;
//	}
//	
//	public String updatePhotograph(PhotographDto pd) {
//		return null;
//	}
//	
//	public String deletePhotograph(Integer id) {
//		return null;
//	}
}
